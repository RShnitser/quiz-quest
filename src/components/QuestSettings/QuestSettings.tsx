import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuiz from "../../providers/QuizProvider";
import { QuizContextType } from "../../providers/QuizProvider";
import InputField from "../InputField/InputField";
import { SettingsData, SettingsInfo } from "../../quiz-api/quiz-types";

const INIT_SETTINGS: SettingsData = {
  count: 5,
  tags: new Map([
    ["HTML", false],
    ["CSS", false],
    ["Javascript", false],
    ["Git", false],
    ["React", false],
  ]),
};

const QuestSettings = () => {
  const { settings, setSettings }: QuizContextType = useQuiz();
  const navigate = useNavigate();
  const [settingsData, setSettingsData] = useState<SettingsData>(INIT_SETTINGS);

  useEffect(() => {
    const newSettings: SettingsData = {
      count: settings.count,
      tags: new Map([
        ["HTML", false],
        ["CSS", false],
        ["Javascript", false],
        ["Git", false],
        ["React", false],
      ]),
    };

    for (const tag of settings.tags) {
      newSettings.tags.set(tag, true);
    }

    setSettingsData(newSettings);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const settings: Settings = {
    //   count: settingsInfo.count,
    //   tags: [
    //     ...Array.from(settingsInfo.tags.keys()).filter((key) => {
    //       return settingsInfo.tags.get(key);
    //     }),
    //   ],
    // };

    const tags: string[] = [];
    for (const entry of settingsData.tags.entries()) {
      if (entry[1] === true) {
        tags.push(entry[0]);
      }
    }

    const newSettings: SettingsInfo = {
      count: settingsData.count,
      tags: tags,
    };

    setSettings(newSettings);
    navigate("/");
  };

  return (
    <div className="center-display">
      <h3 className="title">Settings</h3>
      <form className="form" onSubmit={handleSubmit}>
        <InputField
          label="Question Count: "
          name="count"
          type="number"
          min="2"
          max="15"
          value={settingsData.count.toString()}
          error=""
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => {
            setSettingsData({ ...settingsData, count: parseInt(value) });
          }}
        />
        <label className="input-label">Tags:</label>
        <div className="form-grid">
          {Array.from(settingsData.tags.keys()).map((tag) => (
            <React.Fragment key={tag}>
              <InputField
                label={tag}
                type="checkbox"
                checked={settingsData.tags.get(tag)}
                error=""
                onChange={() => {
                  setSettingsData({
                    ...settingsData,
                    tags: new Map<string, boolean>(
                      settingsData.tags.set(
                        tag,
                        !settingsData.tags.get(tag) || false
                      )
                    ),
                  });
                }}
              />
            </React.Fragment>
          ))}
        </div>
        <input className="form-btn" type="submit" value="Main Menu" />
      </form>
    </div>
  );
};

export default QuestSettings;
