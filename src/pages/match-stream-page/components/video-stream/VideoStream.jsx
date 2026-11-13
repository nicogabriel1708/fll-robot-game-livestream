import { VIDEO_STREAM_SOURCES } from "constants";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { capitalizeFirstLetter } from "utils";
import "./VideoStream.css";

// Mapping: Frontend Farbe -> Backend Worker Side
const SIDE_MAPPING = {
	red: "left",
	blue: "right",
};

const VideoStream = ({ teamColor }) => {
	const [isVideoStreamLoaded, setIsVideoStreamLoaded] = useState(false);
	const [isTracking, setIsTracking] = useState(false);

	// Backend Status abfragen (Polling)
	useEffect(() => {
		const side = SIDE_MAPPING[teamColor];
		if (!side) return;

		const fetchStatus = async () => {
			try {
				// Ersetze 'localhost' ggf. durch die IP deines DGX Servers
				const statusSrc =
					side === "left"
						? process.env.REACT_APP_STREAM_LEFT_STATUS_SRC
						: process.env.REACT_APP_STREAM_RIGHT_STATUS_SRC;
				const response = await fetch(statusSrc);
				if (response.ok) {
					const data = await response.json();
					setIsTracking(data.tracking);
				}
			} catch (error) {
				// Fehler ignorieren (z.B. wenn Backend offline ist), Tracking auslassen
				console.debug("Status fetch failed", error);
			}
		};

		// Alle 250ms abfragen für schnelle UI-Reaktion
		const intervalId = setInterval(fetchStatus, 250);

		// Cleanup beim Unmount
		return () => clearInterval(intervalId);
	}, [teamColor]);

	return (
		<div className={`video-stream__wrapper video-stream__wrapper--${teamColor} children-center`}>
			<img
				src={VIDEO_STREAM_SOURCES[teamColor]}
				alt={`${capitalizeFirstLetter(teamColor)} Team Video`}
				className={`video-stream video-stream--${teamColor} ${isTracking ? "is-tracking" : ""} ${!isVideoStreamLoaded ? "hidden" : ""}`}
				onLoad={() => setIsVideoStreamLoaded(true)}
				onError={() => setIsVideoStreamLoaded(false)}
			/>

			{!isVideoStreamLoaded && <BounceLoader size={100} color={`var(--color-${teamColor})`} />}
		</div>
	);
};

export default VideoStream;
