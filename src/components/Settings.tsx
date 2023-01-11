import React, { useState } from "react";
import InputField from "./InputField";
import { SettingsInfo } from "../quiz-api/quiz-api";

const INIT_SETTINGS: SettingsInfo = {
    count: 5,
    tags: new Map([
        ["HTML", false],
        ["CSS", false],
        ["Javascript", false],
        ["Git", false],
        ["React", false],
    ]),
}

const Settings = () => {

    const [settingsInfo, setQuestionInfo] = useState<SettingsInfo>(INIT_SETTINGS);

    const handleSubmit = () => {

    }

    return(
        <div className="center-display">
            <h3 className="title">Settings</h3>
            <form className="form" onSubmit={handleSubmit}>
            <label className="input-label" >Tags:</label>
                <div className="form-grid">
                    { Array.from(settingsInfo.tags.keys()).map((tag) => (
                        <React.Fragment key={tag}>
                            <InputField 
                                label={tag}
                                type="checkbox"
                                checked={settingsInfo.tags.get(tag)}
                                error=""
                                onChange={() => {
                                    setQuestionInfo({
                                        ...settingsInfo, 
                                        tags: new Map<string, boolean>(settingsInfo.tags.set(tag, !settingsInfo.tags.get(tag) || false))
                                    });
                                    
                                }}

                            />
                        </React.Fragment>
                    ))}
                </div>
                <input className="form-btn" type="submit" value="Save Settings"/>
            </form>
        </div>
    );
}

export default Settings;