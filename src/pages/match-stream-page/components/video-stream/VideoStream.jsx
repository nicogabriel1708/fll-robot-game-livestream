import { VIDEO_STREAM_SOURCES } from "constants";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { capitalizeFirstLetter } from "utils";
import "./VideoStream.css";

const VideoStream = ({ teamColor }) => {
	const [isVideoStreamLoaded, setIsVideoStreamLoaded] = useState(false);

	return (
		<div className={`video-stream__wrapper video-stream__wrapper--${teamColor} children-center`}>
			<img
				src={VIDEO_STREAM_SOURCES[teamColor]}
				alt={`${capitalizeFirstLetter(teamColor)} Team Video`}
				className={`video-stream video-stream--${teamColor} ${!isVideoStreamLoaded ? "hidden" : ""}`}
				onLoad={() => setIsVideoStreamLoaded(true)}
				onError={() => setIsVideoStreamLoaded(false)}
			/>
			{!isVideoStreamLoaded && <BounceLoader size={100} color={`var(--color-${teamColor})`} />}
		</div>
	);
};

export default VideoStream;
