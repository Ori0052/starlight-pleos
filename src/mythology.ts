import type {Text} from './types';

/** Reviewed source-backed scripts are bundled; source refresh never changes these automatically. */
export type MythStory={
 id:string; objectId:string; title:Text; paragraphs:Text[];
 source:{title:string;url:string;revisionUrl:string;historyUrl:string;revisionId:number;section:string;fetchedAt:string;license:string;licenseUrl:string;apiUrl:string};
 adaptation:Text; review:{date:string;scope:Text}; estimatedMinutes:{ko:number;en:number};
};

export const mythologyStories:Record<string,MythStory>={
  "orion": {
    "id": "orion:mythology:v1",
    "objectId": "orion",
    "title": {
      "ko": "오리온과 전갈, 하늘에 남은 이야기",
      "en": "Orion and the Scorpion: a story in the sky"
    },
    "paragraphs": [
      {
        "ko": "나란히 선 세 별을 보며, 오래전 사람들이 하늘에 남긴 이야기를 떠올려 볼까요?",
        "en": "Look at three stars in a row, and imagine the stories people once placed in the sky."
      },
      {
        "ko": "들려드릴 것은 별의 탄생을 설명하는 과학이 아니라, 그리스에서 전해 온 신화예요.",
        "en": "This is a Greek myth, not a scientific explanation of how stars came into being."
      },
      {
        "ko": "오늘은 여러 전승 중 오리온과 아르테미스, 그리고 전갈의 이야기를 만나 보세요.",
        "en": "Among the many versions about Orion, we will follow one involving Artemis and a scorpion."
      },
      {
        "ko": "이 이야기에서 오리온은 바다의 신 포세이돈의 아들이자, 힘이 센 사냥꾼으로 소개돼요.",
        "en": "In this telling, Orion is a strong hunter and a son of Poseidon, god of the sea."
      },
      {
        "ko": "오리온과 사냥의 여신 아르테미스는 서로를 사랑하는 사이였다고 해요.",
        "en": "The story says that Orion and Artemis, goddess of the hunt, loved one another."
      },
      {
        "ko": "하지만 아르테미스의 오빠 아폴론은 두 사람이 함께하는 것을 반기지 않았어요.",
        "en": "But Apollo, the brother of Artemis, did not welcome their wish to be together."
      },
      {
        "ko": "그는 오리온의 거친 성격을 걱정했고, 인간과 신이 맺어지는 일도 받아들이지 못했지요.",
        "en": "He disliked Orion’s fierce nature and would not accept a bond between mortal and goddess."
      },
      {
        "ko": "두 사람이 결혼하려 한다는 소식을 듣자, 아폴론은 대지의 신에게 도움을 청했어요.",
        "en": "When he heard they wished to marry, Apollo asked a deity of the earth for help."
      },
      {
        "ko": "그리하여 오리온 앞에 전갈이 나타났고, 사냥꾼은 커다란 시련을 맞게 되었어요.",
        "en": "A scorpion was sent against Orion, and the hunter faced a dangerous trial."
      },
      {
        "ko": "아르테미스는 아폴론의 행동에 크게 반발하며, 사랑하는 이를 지키려 했어요.",
        "en": "Artemis strongly opposed Apollo’s actions and tried to protect the person she loved."
      },
      {
        "ko": "이 전승의 끝에서 아폴론은 오리온과 전갈을 모두 하늘의 별자리로 올려놓았다고 해요.",
        "en": "At the end, Apollo is said to have placed Orion and the scorpion among the constellations."
      },
      {
        "ko": "하늘의 두 모습은 사람들의 기억 속에 이야기를 오래 남기는 그림이 된 셈이지요.",
        "en": "Those two sky figures became pictures that helped people hold the story in memory."
      },
      {
        "ko": "사람들은 서로 다른 계절의 하늘에 보이는 오리온과 전갈을 이 이야기로 연결했어요.",
        "en": "People connected Orion and Scorpius in different seasonal skies through this story."
      },
      {
        "ko": "그렇다고 별들이 실제로 서로를 쫓거나 다투는 것은 아니랍니다.",
        "en": "That does not mean the actual stars are chasing one another or having a quarrel."
      },
      {
        "ko": "다른 문화에서는 같은 별무리를 양치기나 왕들처럼 다르게 읽었어요.",
        "en": "Other cultures imagined different figures in these stars, including a shepherd or kings."
      },
      {
        "ko": "여러분에게는 가운데 세 별이 허리띠처럼 보이나요, 아니면 또 다른 모양이 떠오르나요?",
        "en": "Do the three middle stars look like a belt, or suggest another shape?"
      },
      {
        "ko": "가족이 한 사람씩 떠오른 모습을 말하며, 같은 하늘에서 서로 다른 상상을 나눠 보세요.",
        "en": "Let each family member share a picture that comes to mind while looking at the sky."
      },
      {
        "ko": "신화에는 여러 판본이 있으니, 오늘 이야기도 그중 한 가지 전승으로 기억해 주세요.",
        "en": "Myths survive in different versions, so remember this as one telling among many."
      }
    ],
    "source": {
      "title": "오리온자리",
      "revisionId": 41081776,
      "section": "신화와 역사",
      "url": "https://ko.wikipedia.org/wiki/%EC%98%A4%EB%A6%AC%EC%98%A8%EC%9E%90%EB%A6%AC#%EC%8B%A0%ED%99%94%EC%99%80_%EC%97%AD%EC%82%AC",
      "revisionUrl": "https://ko.wikipedia.org/w/index.php?title=%EC%98%A4%EB%A6%AC%EC%98%A8%EC%9E%90%EB%A6%AC&oldid=41081776#%EC%8B%A0%ED%99%94%EC%99%80_%EC%97%AD%EC%82%AC",
      "historyUrl": "https://ko.wikipedia.org/w/index.php?title=%EC%98%A4%EB%A6%AC%EC%98%A8%EC%9E%90%EB%A6%AC&action=history",
      "apiUrl": "https://ko.wikipedia.org/w/api.php?action=parse&oldid=41081776&section=5&prop=wikitext&format=json&formatversion=2&origin=*",
      "fetchedAt": "2026-11-14T08:03:33Z",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "adaptation": {
      "ko": "한국어 위키백과의 지정된 신화 문단을 바탕으로 가족용으로 다시 썼습니다. 잔혹한 묘사와 복잡한 관계는 줄이고, 대화 질문과 신화·과학 구분을 더했습니다. 영어 대본은 이 각색의 번역입니다. 원문과 문장·순서가 다릅니다.",
      "en": "Adapted from the identified Korean Wikipedia mythology section for family listening. Graphic details and complex relationships are softened or omitted; family prompts and a distinction between myth and science are added. English is a translation of this adaptation. Wording and order differ from the source."
    },
    "review": {
      "date": "2026-11-14",
      "scope": {
        "ko": "AI 보조 편집: 지정 판본과의 내용 대조, 한영 의미, 어린이용 표현, 대본·자막·음성의 단일 원문 구조를 점검했습니다. 사람의 감수·실제 음성 청취 검증은 미완료입니다.",
        "en": "AI-assisted editorial check of the identified source version, bilingual meaning, family wording, and a single script shared by narration and captions. Human editorial approval and listening on an audio-capable device are not completed."
      }
    },
    "estimatedMinutes": {
      "ko": 2.4,
      "en": 1.8
    }
  },
  "ursa-major": {
    "id": "ursa-major:mythology:v1",
    "objectId": "ursa-major",
    "title": {
      "ko": "큰곰이 된 칼리스토, 함께 읽는 별빛",
      "en": "Callisto and the Great Bear: sharing the starlight"
    },
    "paragraphs": [
      {
        "ko": "북쪽 하늘의 국자 모양을 떠올리며, 별들이 이어 주는 오래된 이야기를 들어 볼까요?",
        "en": "Picture a large ladle in the northern sky, and listen to an old story connected with its stars."
      },
      {
        "ko": "이번 이야기는 그리스 신화 속 칼리스토와 큰곰자리에 관한 한 가지 전승이에요.",
        "en": "This story follows one Greek tradition about Callisto and the constellation we call the Great Bear."
      },
      {
        "ko": "신화는 사람들이 별에 담아 전한 이야기이며, 천체의 탄생을 설명하는 과학은 아니에요.",
        "en": "A myth is a story people passed on through the stars, not a scientific account of their formation."
      },
      {
        "ko": "칼리스토는 제우스와 가까운 사이였고, 제우스의 아내 헤라는 이를 질투했다고 전해져요.",
        "en": "In this tradition, Callisto was close to Zeus, and Hera, his wife, became jealous."
      },
      {
        "ko": "그 질투 때문에 칼리스토는 사람의 모습에서 곰의 모습으로 바뀌고 말았어요.",
        "en": "Because of that jealousy, Callisto was transformed from a person into a bear."
      },
      {
        "ko": "사람의 마음을 가진 채 낯선 모습이 되었다면, 어떤 기분이 들었을지 잠시 상상해 보세요.",
        "en": "Imagine how unfamiliar it might feel to have a human heart inside a different shape."
      },
      {
        "ko": "마음속으로 곰의 모습을 그려 보면, 이야기 속 칼리스토를 다르게 느낄 수도 있겠지요.",
        "en": "As you picture a bear, you may find another way to imagine Callisto in the story."
      },
      {
        "ko": "이 전승에서 제우스는 곰의 모습이 된 칼리스토를 하늘의 별자리로 만들었다고 해요.",
        "en": "This telling says Zeus made Callisto, in the form of a bear, into a constellation."
      },
      {
        "ko": "그래서 큰곰의 모습을 떠올릴 때, 칼리스토의 이름도 함께 기억하는 사람들이 있답니다.",
        "en": "That is why people sometimes remember Callisto when they imagine the Great Bear."
      },
      {
        "ko": "다만 실제 밤하늘에 거대한 곰 한 마리가 떠 있는 것은 아니에요.",
        "en": "Of course, there is not an enormous living bear floating above us in the real sky."
      },
      {
        "ko": "사람들이 멀리 떨어진 별들을 하나의 그림으로 이어서, 이야기를 나눌 길을 만든 것이지요.",
        "en": "People connected separate stars into a shared picture, giving themselves a way to remember a story."
      },
      {
        "ko": "같은 별을 본 다른 문화의 사람들은 또 다른 이야기를 만들어 냈어요.",
        "en": "Other cultures looked at the same stars and found different stories to tell."
      },
      {
        "ko": "인도에는 이 일곱 별을 일곱 현자로 여겼다는 전승도 있어요.",
        "en": "An Indian tradition understands these seven stars as seven sages."
      },
      {
        "ko": "곰도, 현자들도, 하늘을 바라보던 사람들의 기억과 상상에서 이어져 온 모습이에요.",
        "en": "Both the bear and the sages belong to the memories and imagination of people watching the sky."
      },
      {
        "ko": "우리 가족은 이 별들에서 무엇을 발견할 수 있을까요?",
        "en": "What might your own family discover in this pattern of stars?"
      },
      {
        "ko": "누군가는 국자를, 누군가는 동물을 떠올려도 괜찮으니 서로의 그림을 차례로 들어 보세요.",
        "en": "Someone may imagine a ladle and another an animal; take turns listening to each person’s picture."
      },
      {
        "ko": "함께 본 별과 나눈 말을 기록하면, 오늘의 별빛도 가족의 작은 이야기가 될 거예요.",
        "en": "Record the stars and words you shared, and tonight can become a small family story."
      },
      {
        "ko": "칼리스토 이야기에도 여러 판본이 있으며, 오늘은 그중 한 가지 전승을 들려드렸어요.",
        "en": "Callisto’s story has different versions; this adaptation follows one brief tradition."
      }
    ],
    "source": {
      "title": "큰곰자리",
      "revisionId": 40597122,
      "section": "신화",
      "url": "https://ko.wikipedia.org/wiki/%ED%81%B0%EA%B3%B0%EC%9E%90%EB%A6%AC#%EC%8B%A0%ED%99%94",
      "revisionUrl": "https://ko.wikipedia.org/w/index.php?title=%ED%81%B0%EA%B3%B0%EC%9E%90%EB%A6%AC&oldid=40597122#%EC%8B%A0%ED%99%94",
      "historyUrl": "https://ko.wikipedia.org/w/index.php?title=%ED%81%B0%EA%B3%B0%EC%9E%90%EB%A6%AC&action=history",
      "apiUrl": "https://ko.wikipedia.org/w/api.php?action=parse&oldid=40597122&section=6&prop=wikitext&format=json&formatversion=2&origin=*",
      "fetchedAt": "2026-11-14T08:03:33Z",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "adaptation": {
      "ko": "한국어 위키백과의 지정된 신화 문단을 바탕으로 가족용으로 다시 썼습니다. 잔혹한 묘사와 복잡한 관계는 줄이고, 대화 질문과 신화·과학 구분을 더했습니다. 영어 대본은 이 각색의 번역입니다. 원문과 문장·순서가 다릅니다.",
      "en": "Adapted from the identified Korean Wikipedia mythology section for family listening. Graphic details and complex relationships are softened or omitted; family prompts and a distinction between myth and science are added. English is a translation of this adaptation. Wording and order differ from the source."
    },
    "review": {
      "date": "2026-11-14",
      "scope": {
        "ko": "AI 보조 편집: 지정 판본과의 내용 대조, 한영 의미, 어린이용 표현, 대본·자막·음성의 단일 원문 구조를 점검했습니다. 사람의 감수·실제 음성 청취 검증은 미완료입니다.",
        "en": "AI-assisted editorial check of the identified source version, bilingual meaning, family wording, and a single script shared by narration and captions. Human editorial approval and listening on an audio-capable device are not completed."
      }
    },
    "estimatedMinutes": {
      "ko": 2.4,
      "en": 1.8
    }
  },
  "cassiopeia": {
    "id": "cassiopeia:mythology:v1",
    "objectId": "cassiopeia",
    "title": {
      "ko": "카시오페이아의 의자와 이어지는 하늘",
      "en": "Cassiopeia’s chair and a sky of connected stories"
    },
    "paragraphs": [
      {
        "ko": "다섯 별의 지그재그를 보며, 하늘에 놓인 의자를 상상해 볼까요?",
        "en": "Look at five zigzag stars, and imagine a chair placed among the lights of the sky."
      },
      {
        "ko": "지금 들려드릴 것은 카시오페이아자리와 연결된 그리스 신화의 한 가지 전승이에요.",
        "en": "We will follow one Greek tradition connected with the constellation Cassiopeia."
      },
      {
        "ko": "신화 속 카시오페이아는 아이티오피아의 왕비이자, 안드로메다 공주의 어머니였어요.",
        "en": "In the myth, Cassiopeia was queen of Aithiopia and the mother of Princess Andromeda."
      },
      {
        "ko": "왕비는 자랑하기를 좋아했고, 딸의 아름다움을 바다의 정령 네레이데스와 비교했지요.",
        "en": "The queen loved to boast and compared her daughter’s beauty with the sea spirits called the Nereids."
      },
      {
        "ko": "그 말을 듣고 바다의 신 포세이돈이 노하여, 나라에 큰 재해가 닥쳤다고 해요.",
        "en": "The story says Poseidon, god of the sea, became angry, and disaster struck the kingdom."
      },
      {
        "ko": "이야기의 갈등 속에서 안드로메다는 바닷가의 위험한 상황에 놓이게 되었어요.",
        "en": "During the conflict, Andromeda found herself in danger beside the sea."
      },
      {
        "ko": "어려움에 처한 공주에게 어떤 도움이 찾아올지, 다음 장면을 함께 들어 보세요.",
        "en": "Listen for the help that comes to the princess in the next part of the tale."
      },
      {
        "ko": "그때 용사 페르세우스가 나타나 바다 괴물에게 위협받던 안드로메다를 구해 주었어요.",
        "en": "Then the hero Perseus appeared and rescued Andromeda from the sea creature threatening her."
      },
      {
        "ko": "이렇게 왕비의 자랑에서 시작된 이야기는 공주와 용사의 이야기로 이어진답니다.",
        "en": "A tale beginning with the queen’s boasting becomes connected with a princess and a hero."
      },
      {
        "ko": "뒤이어 카시오페이아가 의자와 함께 하늘에 놓였다는 전승이 전해져요.",
        "en": "A related tradition tells of Cassiopeia being placed in the sky together with her chair."
      },
      {
        "ko": "또 다른 설명에서는 쉬지 못하고 하늘을 계속 돌게 되었다고도 하지요.",
        "en": "Another explanation says she was made to keep circling the sky without rest."
      },
      {
        "ko": "같은 별자리를 두고도 전해지는 모습과 결말이 조금씩 다른 거예요.",
        "en": "Even for one constellation, the details and endings of stories can differ."
      },
      {
        "ko": "세페우스와 안드로메다, 페르세우스 같은 다른 별자리도 이 신화와 연결돼요.",
        "en": "This myth is also connected with other constellations, including Cepheus, Andromeda, and Perseus."
      },
      {
        "ko": "하늘을 커다란 이야기책으로 생각하면, 별자리 하나가 다음 이야기의 문을 열어 주는 셈이지요.",
        "en": "Imagine the sky as a storybook, where one constellation opens a door to the next tale."
      },
      {
        "ko": "실제 별의 움직임은 왕비의 벌이 아니라, 과학으로 살펴볼 수 있는 자연현상이랍니다.",
        "en": "The real apparent motion of stars is a natural phenomenon studied scientifically, not a queen’s punishment."
      },
      {
        "ko": "우리 가족은 서로를 비교하는 말보다, 각자의 좋은 점을 발견하는 말을 나눠 보면 어떨까요?",
        "en": "What if your family shares something kind about each person, instead of comparing one with another?"
      },
      {
        "ko": "지그재그 다섯 별에 마음속 의자를 놓으며, 오늘 나눈 따뜻한 한마디를 함께 기억해 주세요.",
        "en": "Picture a chair among those five stars, and remember one warm thing your family said tonight."
      },
      {
        "ko": "오늘은 여러 전승 중 하나를 가족용으로 각색했으며, 과학 설명과 구분해 들려드렸어요.",
        "en": "Today’s story adapts one tradition for family listening and keeps myth separate from scientific explanation."
      }
    ],
    "source": {
      "title": "카시오페이아자리",
      "revisionId": 40004560,
      "section": "신화",
      "url": "https://ko.wikipedia.org/wiki/%EC%B9%B4%EC%8B%9C%EC%98%A4%ED%8E%98%EC%9D%B4%EC%95%84%EC%9E%90%EB%A6%AC#%EC%8B%A0%ED%99%94",
      "revisionUrl": "https://ko.wikipedia.org/w/index.php?title=%EC%B9%B4%EC%8B%9C%EC%98%A4%ED%8E%98%EC%9D%B4%EC%95%84%EC%9E%90%EB%A6%AC&oldid=40004560#%EC%8B%A0%ED%99%94",
      "historyUrl": "https://ko.wikipedia.org/w/index.php?title=%EC%B9%B4%EC%8B%9C%EC%98%A4%ED%8E%98%EC%9D%B4%EC%95%84%EC%9E%90%EB%A6%AC&action=history",
      "apiUrl": "https://ko.wikipedia.org/w/api.php?action=parse&oldid=40004560&section=5&prop=wikitext&format=json&formatversion=2&origin=*",
      "fetchedAt": "2026-11-14T08:03:33Z",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "adaptation": {
      "ko": "한국어 위키백과의 지정된 신화 문단을 바탕으로 가족용으로 다시 썼습니다. 잔혹한 묘사와 복잡한 관계는 줄이고, 대화 질문과 신화·과학 구분을 더했습니다. 영어 대본은 이 각색의 번역입니다. 원문과 문장·순서가 다릅니다.",
      "en": "Adapted from the identified Korean Wikipedia mythology section for family listening. Graphic details and complex relationships are softened or omitted; family prompts and a distinction between myth and science are added. English is a translation of this adaptation. Wording and order differ from the source."
    },
    "review": {
      "date": "2026-11-14",
      "scope": {
        "ko": "AI 보조 편집: 지정 판본과의 내용 대조, 한영 의미, 어린이용 표현, 대본·자막·음성의 단일 원문 구조를 점검했습니다. 사람의 감수·실제 음성 청취 검증은 미완료입니다.",
        "en": "AI-assisted editorial check of the identified source version, bilingual meaning, family wording, and a single script shared by narration and captions. Human editorial approval and listening on an audio-capable device are not completed."
      }
    },
    "estimatedMinutes": {
      "ko": 2.3,
      "en": 1.8
    }
  }
};

export const getMythStory=(objectId:string):MythStory|undefined=>mythologyStories[objectId];
