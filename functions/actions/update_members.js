const initializeApp = require('../firebase')

const app = initializeApp()
const db = app.firestore()

const members = {
  'haneru-inaba': {
    'name': 'Haneru Inaba',
    'name_ja': '因幡はねる',
    'group': 'animare',
  },
  'hinako-umori': {
    'name': 'Hinako Umori',
    'name_ja': '宇森ひなこ',
    'group': 'animare',
  },
  'ichika-soya': {
    'name': 'Ichika Soya',
    'name_ja': '宗谷いちか',
    'group': 'animare',
  },
  'kuromu-inari': {
    'name': 'Kuromu Inari',
    'name_ja': '稲荷くろむ',
    'group': 'animare',
  },
  'ran-hinokuma': {
    'name': 'Ran Hinokuma',
    'name_ja': '日ノ隈らん',
    'group': 'animare',
  },
  'patra-suo': {
    'name': 'Patra Suo',
    'name_ja': '周防パトラ',
    'group': 'honey-strap',
  },
  'charlotte-shimamura': {
    'name': 'Charlotte Shimamura',
    'name_ja': '島村シャルロット',
    'group': 'honey-strap',
  },
  'eli-sogetsu': {
    'name': 'Eli Sogetsu',
    'name_ja': '蒼月エリ',
    'group': 'honey-strap',
  },
  'mico-sekishiro': {
    'name': 'Mico Sekishiro',
    'name_ja': '堰代ミコ',
    'group': 'honey-strap',
  },
  'mary-saionji': {
    'name': 'Mary Saionji',
    'name_ja': '西園寺メアリ',
    'group': 'honey-strap',
  },
}

module.exports = async () => {
  const batch = db.batch()
  for (let key of Object.keys(members)) {
    const member = members[key]
    const ref = db.collection('anihani-members').doc(key)
    batch.set(ref, {
      ...member,
      group: db.collection('anihani-groups').doc(member.group)
    })
  }
  await batch.commit()
  console.log('updated rows: %s', Object.keys(members).length)
}
