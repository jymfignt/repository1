export type ChoiceEffect = {
  stats?: {
    skill?: number;
    creativity?: number;
    network?: number;
    wealth?: number;
    wellbeing?: number;
    integrity?: number;
    risk?: number;
  };
  flags?: {
    hasStartup?: boolean;
    hasCorporateJob?: boolean;
    hasCreativeWork?: boolean;
    hasFamily?: boolean;
    hasMentor?: boolean;
    hasBurnout?: boolean;
    hasEthicalDilemma?: boolean;
    hasMajorFailure?: boolean;
    hasMajorSuccess?: boolean;
    hasSecretKnowledge?: boolean;
  };
};

export type Choice = { text: string; next: string; effects?: ChoiceEffect };
export type Node = { id: string; text: string; choices: Choice[] };
export type Character = { name: string; description: string; energy: number; creativity: number };

export const character: Character = {
  name: "林淼",
  description: "刚毕业的你,既想稳定也向往自由。",
  energy: 40,
  creativity: 58
};

export const story: Node[] = [
  // 开始
  { id: "start", text: "你刚刚大学毕业,面对迷茫的未来。房间里只有一台旧电脑和一杯冷掉的咖啡。", choices: [
    { text: "打开招聘网站,投简历", next: "jobsearch1", effects: { stats: { skill: 5, network: 3, wellbeing: -2 } } },
    { text: "去咖啡馆写小说", next: "writer1", effects: { stats: { creativity: 8, wellbeing: 3, wealth: -1 }, flags: { hasCreativeWork: true } } },
    { text: "躺着刷短视频", next: "slacker1", effects: { stats: { wellbeing: 2, creativity: -3, skill: -1 } } }
  ] },

  // 求职线
  { id: "jobsearch1", text: "你投出了几十份简历，终于收到了面试通知。", choices: [
    { text: "精心准备", next: "jobsearch2", effects: { stats: { skill: 8, wellbeing: -3 } } },
    { text: "随便应付", next: "fail1", effects: { stats: { skill: 2, wellbeing: 1 } } }
  ] },
  { id: "jobsearch2", text: "面试当天，你表现得很自信。面试官露出了赞许的笑容。", choices: [
    { text: "接受 offer", next: "career1", effects: { stats: { wealth: 10, network: 5, wellbeing: 3 }, flags: { hasCorporateJob: true } } },
    { text: "拒绝，另寻机会", next: "writer1", effects: { stats: { creativity: 5, risk: 3 } } }
  ] },
  { id: "career1", text: "你进入了一家大公司。虽然压力大，但你逐渐适应并获得晋升机会。", choices: [
    { text: "全力以赴", next: "goodend_career", effects: { stats: { skill: 10, wealth: 15, wellbeing: -8, risk: 5 }, flags: { hasMajorSuccess: true, hasBurnout: true } } },
    { text: "考虑转行", next: "writer2", effects: { stats: { creativity: 8, wellbeing: 5 } } }
  ] },
  { id: "goodend_career", text: "你成为了团队核心，事业稳定，生活安定。——【职业线好结局】", choices: [] },

  // 作家线
  { id: "writer1", text: "你开始写小说，但最初的点击量寥寥。", choices: [
    { text: "坚持更新", next: "writer2" },
    { text: "心灰意冷", next: "slacker2" }
  ] },
  { id: "writer2", text: "你的作品渐渐有了读者，甚至收到了出版社的邀约。", choices: [
    { text: "签约出版", next: "writer3" },
    { text: "保持独立创作", next: "writer4" }
  ] },
  { id: "writer3", text: "你的作品出版后广受好评，你成为新锐作家。", choices: [
    { text: "继续创作", next: "goodend_writer" }
  ] },
  { id: "writer4", text: "你坚持自我风格，虽然收入不稳定，但拥有了一批忠实读者。", choices: [
    { text: "追求更高成就", next: "goodend_writer" }
  ] },
  { id: "goodend_writer", text: "你实现了梦想，获得了精神自由与创作成就。——【作家线好结局】", choices: [] },

  // 创业线
  { id: "entrepreneur1", text: "你决定创业，但缺乏资金和经验。", choices: [
    { text: "寻找投资人", next: "entrepreneur2", effects: { stats: { network: 8, risk: 10, wealth: -5 }, flags: { hasStartup: true } } },
    { text: "从小本生意开始", next: "entrepreneur3", effects: { stats: { risk: 5, wealth: -3, skill: 3 }, flags: { hasStartup: true } } },
    { text: "先打工积累经验", next: "jobsearch1", effects: { stats: { skill: 8, network: 5, risk: -3 } } }
  ] },
  { id: "entrepreneur2", text: "你开始寻找投资人，但大多数人都对你的想法持怀疑态度。", choices: [
    { text: "坚持不懈地推销", next: "entrepreneur4" },
    { text: "调整商业模式", next: "entrepreneur3" },
    { text: "暂时放弃创业", next: "writer1" }
  ] },
  { id: "entrepreneur3", text: "你从小本生意开始，开了一家小店铺。虽然辛苦，但慢慢有了起色。", choices: [
    { text: "扩大经营规模", next: "entrepreneur5" },
    { text: "保持现状", next: "entrepreneur6" },
    { text: "转型做其他生意", next: "entrepreneur2" }
  ] },
  { id: "entrepreneur4", text: "你的坚持打动了投资人，获得了第一轮融资。", choices: [
    { text: "快速发展业务", next: "entrepreneur7" },
    { text: "谨慎扩张", next: "entrepreneur5" }
  ] },
  { id: "entrepreneur5", text: "你的生意越做越大，开始考虑上市的可能性。", choices: [
    { text: "准备IPO", next: "entrepreneur8" },
    { text: "继续稳步发展", next: "goodend_entrepreneur" }
  ] },
  { id: "entrepreneur6", text: "你选择保持现状，过着相对稳定的生活。", choices: [
    { text: "继续当前生活", next: "goodend_entrepreneur_small" },
    { text: "寻找新机会", next: "entrepreneur2" }
  ] },
  { id: "entrepreneur7", text: "公司快速发展，你成为了行业的新星企业家。", choices: [
    { text: "追求更大成就", next: "entrepreneur8" },
    { text: "享受成功果实", next: "goodend_entrepreneur" }
  ] },
  { id: "entrepreneur8", text: "你的公司成功上市，你成为了亿万富翁。", choices: [
    { text: "继续创业新项目", next: "goodend_entrepreneur_legend" },
    { text: "转向投资领域", next: "goodend_entrepreneur" }
  ] },
  { id: "goodend_entrepreneur", text: "你成功创业，实现了财务自由，成为了受人尊敬的企业家。——【创业线好结局】", choices: [] },
  { id: "goodend_entrepreneur_small", text: "虽然规模不大，但你拥有自己的事业，生活充实而满足。——【创业线小成就结局】", choices: [] },
  { id: "goodend_entrepreneur_legend", text: "你成为了创业传奇，多次成功创业，改变了整个行业。——【创业线传奇结局】", choices: [] },

  // 躺平线
  { id: "slacker1", text: "你选择了自由自在的生活，暂时没有工作。", choices: [
    { text: "打游戏放松", next: "slacker2" },
    { text: "偶尔兼职", next: "slacker3" }
  ] },
  { id: "slacker2", text: "日子一天天过去，你开始感到焦虑和迷茫。", choices: [
    { text: "尝试改变", next: "jobsearch1" },
    { text: "继续颓废", next: "badend_slacker" }
  ] },
  { id: "slacker3", text: "兼职收入勉强维持生活，但你觉得缺乏目标。", choices: [
    { text: "转为全职努力", next: "jobsearch2" },
    { text: "维持现状", next: "badend_slacker" }
  ] },
  { id: "badend_slacker", text: "你逐渐失去了方向，生活被动，心中充满空虚。——【躺平线坏结局】", choices: [] },

  // 失败结局
  { id: "fail1", text: "你没有认真对待面试，最终被淘汰。", choices: [
    { text: "重新振作", next: "jobsearch1" },
    { text: "放弃", next: "slacker2" }
  ] }
];
