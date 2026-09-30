/* Setting summaries, not verbatim quotations or complete potion recipes.
   No chapter-level verification has been completed for this edition. */
const APOTHEOSIS_RITUALS = {
  fool: {
    status:'summary',
    title:'愚弄命运、时间或历史',
    steps:['在命运、时间、历史之中，至少愚弄其中一项。','以达成这一条件为核心，完成向「愚者」的晋升。'],
    note:'这里概括的是仪式核心，不把克莱恩在特定情境中的全部做法当成所有晋升者都必须重复的步骤。'
  },
  error: {
    status:'summary',
    title:'在他人的成神仪式中取而代之',
    steps:['选择另一位正在举行成神仪式的对象。','在对方的晋升过程中窃取成果、取代其位置，借此完成自己的成神。'],
    note:'重点在于对成神过程的窃取与替代，不能简化为偷走一件物品或一份非凡特性。'
  },
  door: {
    status:'summary',
    title:'在星空中留下自己的传说',
    steps:['前往星球之外，游历星空。','在九个不同的地点留下属于自己的传说，以此作为成神仪式的核心条件。'],
    note:'这里的地点不是同一星球上的九座城市；本条为设定摘要，尚未完成原文章节级复核。'
  },
  visionary: {
    status:'summary',
    title:'让时代的发展符合自己的预期',
    steps:['安排、推动时代的发展，使其走向符合自己的预期。','在相应的时代潮流中完成晋升。'],
    note:'要求涉及时代层面的进程，不能等同于让一件小事按照计划发生。这里只列核心，不展开具体布局。'
  },
  red: {
    status:'summary',
    title:'掀起席卷大陆的战争并取得胜利',
    steps:['掀起一场席卷整片大陆的战争。','在战争中获得足够的胜利，以此完成成神仪式。'],
    note:'胜利的具体判定未在此量化；不会把个人决斗或局部冲突等同于这项仪式。'
  },
  emperor: {
    status:'summary',
    title:'建立帝国、非常规秩序与九座陵寝',
    steps:['拥有自己的国家，让自己的名字与「皇帝」建立联系，成为民众的共同认知。','建立一套严密、复杂且有悖常理的规则，让它体现在社会秩序与日常生活中。','准备九座秘密陵寝，并让民众参与相应的仪式准备。','以这些秩序与陵寝为基础，在其中一座陵寝中完成晋升。'],
    note:'黑皇帝的仪式涉及较多细节，这里只列主要构成，不是完整条件清单；民众参与、陵寝建设等细节仍需对照原文核实。'
  }
};
const UNKNOWN_APOTHEOSIS_RITUAL = {
  status:'unverified',
  title:'完整仪式条件待核实',
  steps:[],
  note:'目前未核实到这条途径完整、可靠的序列 0 仪式条件，暂不列出具体步骤。已有成神者的经历、尊名或权柄描述，不能直接当作晋升仪式。此状态不等于断言原作从未公开。'
};
function getApotheosisRitual(pathwayId) {
  return APOTHEOSIS_RITUALS[pathwayId] || UNKNOWN_APOTHEOSIS_RITUAL;
}
if(typeof module!=='undefined') module.exports={APOTHEOSIS_RITUALS,getApotheosisRitual};
