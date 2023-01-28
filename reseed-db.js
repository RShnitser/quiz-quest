import { writeFileSync } from "fs";

const db = {
    "users": [
      {
        "userName": "John",
        "password": "12345",
        "id": 1
      },
      {
        "userName": "Sally",
        "password": "scoobydoo",
        "id": 2
      }
    ],
    "questions": [
      {
        "question": "HTML is an acronym for Hypertext _________ Language.",
        "type": "Fill in the blank",
        "answer": "Markup",
        "tags": [
          "HTML"
        ],
        "id": 1
      },
      {
        "question": "Git allows you to work on a new feature without breaking existing code by creating a new __________.",
        "type": "Fill in the blank",
        "answer": "branch",
        "tags": [
          "Git"
        ],
        "id": 2
      },
      {
        "question": "These are block level elements.",
        "type": "All that apply",
        "options": [
          {
            "id": 0,
            "answer": "<p>",
            "answerApplies": true
          },
          {
            "id": 1,
            "answer": "<div>",
            "answerApplies": true
          },
          {
            "id": 2,
            "answer": "<span>",
            "answerApplies": false
          },
          {
            "id": 3,
            "answer": "<nav>",
            "answerApplies": true
          }
        ],
        "tags": [
          "HTML"
        ],
        "id": 3
      },
      {
        "question": "These methods will always iterate through the entire array.",
        "type": "All that apply",
        "options": [
          {
            "id": 0,
            "answer": "map()",
            "answerApplies": true
          },
          {
            "id": 1,
            "answer": "reduce()",
            "answerApplies": true
          },
          {
            "id": 2,
            "answer": "filter()",
            "answerApplies": true
          },
          {
            "id": 3,
            "answer": "find()",
            "answerApplies": false
          }
        ],
        "tags": [
          "Javascript"
        ],
        "id": 4
      },
      {
        "question": "Which hook can be used to run code once when the component is created?",
        "type": "Multiple Choice",
        "answer": {
          "id": 0,
          "answer": "iseEffect"
        },
        "options": [
          {
            "id": 0,
            "answer": "useEffect"
          },
          {
            "id": 1,
            "answer": "useState"
          },
          {
            "id": 2,
            "answer": "useContext"
          },
          {
            "id": 3,
            "answer": "useMemo"
          }
        ],
        "tags": [
          "React"
        ],
        "id": 5
      },
      {
        "question": "Arrays start at index",
        "type": "Multiple Choice",
        "answer": {
          "id": 0,
          "answer": "0"
        },
        "options": [
          {
            "id": 0,
            "answer": "0"
          },
          {
            "id": 1,
            "answer": "1"
          },
          {
            "id": 2,
            "answer": "2"
          },
          {
            "id": 3,
            "answer": "3"
          }
        ],
        "tags": [
          "Javascript"
        ],
        "id": 6
      },
      {
        "question": "The command git checkout -b feature-nav will",
        "type": "Multiple Choice",
        "answer": {
          "id": 0,
          "answer": "Create a new branch called feature-nav and switch to it"
        },
        "options": [
          {
            "id": 0,
            "answer": "Create a new branch called feature-nav and switch to it"
          },
          {
            "id": 1,
            "answer": "Delete the brnach called feature-nav"
          },
          {
            "id": 2,
            "answer": "Create a new branch called feature-nav"
          },
          {
            "id": 3,
            "answer": "Switch to the existing branch called feature-nav"
          }
        ],
        "tags": [
          "Git"
        ],
        "id": 7
      },
      {
        "question": "These are valid units of length in CSS",
        "type": "All that apply",
        "options": [
          {
            "id": 0,
            "answer": "vmax",
            "answerApplies": true
          },
          {
            "id": 1,
            "answer": "%",
            "answerApplies": true
          },
          {
            "id": 2,
            "answer": "m",
            "answerApplies": false
          },
          {
            "id": 3,
            "answer": "px",
            "answerApplies": true
          }
        ],
        "tags": [
          "CSS"
        ],
        "id": 8
      }
    ],
    "history": [
      {
        "userId": 2,
        "questionId": 8,
        "answer": {
          "type": "All that apply",
          "answer": [
            {
              "id": 3,
              "applies": true
            },
            {
              "id": 1,
              "applies": true
            },
            {
              "id": 2,
              "applies": false
            },
            {
              "id": 0,
              "applies": false
            }
          ]
        },
        "date": 1674876567077,
        "id": 1
      },
      {
        "userId": 2,
        "questionId": 2,
        "answer": {
          "type": "Fill in the blank",
          "answer": "commit"
        },
        "date": 1674876586877,
        "id": 2
      },
      {
        "userId": 2,
        "questionId": 6,
        "answer": {
          "type": "Multiple Choice",
          "answer": 0,
          "order": [
            0,
            1,
            2,
            3
          ]
        },
        "date": 1674876589416,
        "id": 3
      },
      {
        "userId": 2,
        "questionId": 5,
        "answer": {
          "type": "Multiple Choice",
          "answer": 0,
          "order": [
            2,
            3,
            0,
            1
          ]
        },
        "date": 1674876623196,
        "id": 4
      },
      {
        "userId": 2,
        "questionId": 4,
        "answer": {
          "type": "All that apply",
          "answer": [
            {
              "id": 2,
              "applies": true
            },
            {
              "id": 1,
              "applies": true
            },
            {
              "id": 0,
              "applies": true
            },
            {
              "id": 3,
              "applies": false
            }
          ]
        },
        "date": 1674876630772,
        "id": 5
      },
      {
        "userId": 1,
        "questionId": 1,
        "answer": {
          "type": "Fill in the blank",
          "answer": "markup"
        },
        "date": 1674876682892,
        "id": 6
      },
      {
        "userId": 1,
        "questionId": 2,
        "answer": {
          "type": "Fill in the blank",
          "answer": "branch"
        },
        "date": 1674876688203,
        "id": 7
      },
      {
        "userId": 1,
        "questionId": 4,
        "answer": {
          "type": "All that apply",
          "answer": [
            {
              "id": 3,
              "applies": true
            },
            {
              "id": 2,
              "applies": true
            },
            {
              "id": 1,
              "applies": true
            },
            {
              "id": 0,
              "applies": true
            }
          ]
        },
        "date": 1674876697015,
        "id": 8
      },
      {
        "userId": 1,
        "questionId": 8,
        "answer": {
          "type": "All that apply",
          "answer": [
            {
              "id": 0,
              "applies": true
            },
            {
              "id": 2,
              "applies": true
            },
            {
              "id": 1,
              "applies": false
            },
            {
              "id": 3,
              "applies": true
            }
          ]
        },
        "date": 1674876701987,
        "id": 9
      },
      {
        "userId": 1,
        "questionId": 7,
        "answer": {
          "type": "Multiple Choice",
          "answer": 0,
          "order": [
            3,
            0,
            1,
            2
          ]
        },
        "date": 1674876759298,
        "id": 10
      }
    ]
  };

writeFileSync("db.json", JSON.stringify(db, null, 2));