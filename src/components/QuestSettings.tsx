import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../providers/QuizProvider";
import { QuizContextType } from "../providers/QuizProvider";
import InputField from "./InputField";
import { SettingsInfo, Settings } from "../quiz-api/quiz-api";

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

const QuestSettings = () => {

    const {settings, setSettings} : QuizContextType  = useQuiz();
    const navigate = useNavigate();
    const [settingsInfo, setSettingsInfo] = useState<SettingsInfo>(INIT_SETTINGS);

    useEffect(() => {
        const newSettings: SettingsInfo = {
            count: settings.count,
            tags: new Map([
                ["HTML", false],
                ["CSS", false],
                ["Javascript", false],
                ["Git", false],
                ["React", false],
            ]),
        }

        for(const tag of settings.tags) {
            newSettings.tags.set(tag, true);
        }

        setSettingsInfo(newSettings);
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const settings: Settings = {
            count: settingsInfo.count,
            tags: [...Array.from(settingsInfo.tags.keys()).filter((key) => {
                return (settingsInfo.tags.get(key));
            })]
        }

        setSettings(settings);
        navigate("/");
    }

    return(
        <div className="center-display">
            <h3 className="title">Settings</h3>
            <form className="form" onSubmit={handleSubmit}>
                <InputField 
                    label="Question Count: " 
                    name="count" 
                    type="number"
                    min="2"
                    max="15"
                    value={settingsInfo.count.toString()}
                    error=""
                    onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                        setSettingsInfo({...settingsInfo, count: parseInt(value)});
                    }}
                />
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
                                    setSettingsInfo({
                                        ...settingsInfo, 
                                        tags: new Map<string, boolean>(settingsInfo.tags.set(tag, !settingsInfo.tags.get(tag) || false))
                                    });
                                    
                                }}

                            />
                        </React.Fragment>
                    ))}
                </div>
                <input className="form-btn" type="submit" value="Main Menu"/>
            </form>
        </div>
    );
}

export default QuestSettings;