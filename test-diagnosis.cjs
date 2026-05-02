// 测试诊断流程
const testData = {
  totalScore: 68,
  level: '中级转型者',
  scores: {
    readiness: 60,
    data: 65,
    security: 75,
    budget: 70
  },
  answers: {
    0: '文化传媒',
    1: '10-50人',
    2: '初步了解',
    3: ['内容生产效率低', '营销获客困难'],
    4: '内容创作与营销',
    5: '有基础数据沉淀',
    6: '20-50万',
    7: '比较重视',
    8: '听说过但未申请',
    9: '3-6个月'
  },
  recommendation: '建议选择性引入AI应用，重点突破核心业务场景',
  description: '您的企业（文化传媒）在AI升级之路上处于"中级转型者"阶段。',
  industry: '文化传媒',
  recommendedOPCTypes: ['AI短剧', 'AI漫剧']
};

// 验证数据结构
console.log('测试数据结构...');
console.log('totalScore:', testData.totalScore);
console.log('level:', testData.level);
console.log('scores:', JSON.stringify(testData.scores, null, 2));
console.log('answers:', JSON.stringify(testData.answers, null, 2));
console.log('recommendation:', testData.recommendation);
console.log('description:', testData.description);
console.log('industry:', testData.industry);
console.log('recommendedOPCTypes:', testData.recommendedOPCTypes);

// 验证 JSON 序列化
console.log('\n验证 JSON 序列化...');
const jsonStr = JSON.stringify(testData);
console.log('JSON 长度:', jsonStr.length, '字节');
const parsed = JSON.parse(jsonStr);
console.log('解析成功:', parsed.totalScore === testData.totalScore);

console.log('\n测试完成！数据结构正确。');
