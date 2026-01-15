import { TeamColor } from "constants";
import { useEffect, useRef } from "react";
import Select from "react-select";
import { capitalizeFirstLetter } from "utils";
import "./TeamSelectPage.css";

const TeamSelectPage = ({
	teamNames,
	resetTeamNames,
	updateTeamName,
	teamNameList,
	setTeamNameList,
	goToMatchStream,
}) => {
	const { [TeamColor.RED]: redTeamName, [TeamColor.BLUE]: blueTeamName } = teamNames;
	const isTeamNameUploadRequired = teamNameList.length < 2;

	const fileInputRef = useRef(null);

	useEffect(resetTeamNames, [resetTeamNames]);

	const createTeamNameSelectOptions = (disabledTeamName) =>
		teamNameList?.map((teamName) => ({
			value: teamName,
			label: teamName,
			isDisabled: teamName === disabledTeamName,
		}));

	const onTeamNameSelectChange = (teamColor) => (selectedOption) =>
		updateTeamName(teamColor, selectedOption ? selectedOption.value : "");

	const renderTeamNameSelect = (teamColor, disabledTeamName) => (
		<Select
			className="team-name-select"
			placeholder={`${capitalizeFirstLetter(teamColor)} Team`}
			options={createTeamNameSelectOptions(disabledTeamName)}
			onChange={onTeamNameSelectChange(teamColor)}
			isSearchable
			isClearable
		/>
	);

	const triggerFileInputClick = () => fileInputRef.current?.click();

	const updateTeamNameList = (text) => {
		const newTeamNameList = text
			.split("\n")
			.map((teamName) => teamName.trim())
			.filter((teamName) => teamName.length > 0);

		setTeamNameList(newTeamNameList);
	};

	const onFileInputChange = async (e) => {
		const file = e.target.files[0];

		if (!file) {
			return;
		}

		const text = await file.text();

		updateTeamNameList(text);
	};

	return (
		<div className="team-select-page__wrapper">
			<div className="team-select-page__container">
				<h1>{isTeamNameUploadRequired ? "Upload Team Names" : "Select Teams"}</h1>
				<p>
					{isTeamNameUploadRequired
						? "Upload a text file (.txt) containing at least two team names (one per line) to proceed."
						: "Select both teams to continue to the match stream."}
				</p>
				{!isTeamNameUploadRequired && (
					<div>
						{renderTeamNameSelect(TeamColor.RED, blueTeamName)}
						{renderTeamNameSelect(TeamColor.BLUE, redTeamName)}
					</div>
				)}
				{isTeamNameUploadRequired ? (
					<button onClick={triggerFileInputClick}>Upload</button>
				) : (
					<button onClick={goToMatchStream} disabled={!redTeamName || !blueTeamName}>
						Continue
					</button>
				)}
				<input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={onFileInputChange} />
			</div>
		</div>
	);
};

export default TeamSelectPage;
