import * as THREE from 'three';
import { Krathong } from './krathong.js';

const NPC_NAMES = [
  'สมชาย ใจดี', 'กานดา สุขสวัสดิ์', 'อนันต์ บุญมี', 'มณีรัตน์ โชติช่วง',
  'ธนกฤต พงศ์ไพศาล', 'ณัฐริกา ศรีสุข', 'วิทยา มงคลชัย', 'ศศิธร รัตนวิเชียร',
  'ภาคิน วัฒนศิลป์', 'ปิยดา วงศ์สุวรรณ', 'ชัชวาล เลิศปัญญา', 'ชลธิชา นาวิน',
  'กมลวรรณ รักษ์สยาม', 'พิมลภัทร สุวรรณมาลี', 'นพดล เจริญรัตน์', 'สิรินทร์ ภัทราพร',
  'ธีรภัทร ร่มเกล้า', 'วนิดา พรสถิตย์', 'ปวีณา ธนสมบัติ', 'กัญญาณัฐ ทิพยวารี'
];

const NPC_WISHES = [
  'ขอขมาพระแม่คงคา บูชารอยพระบรมพุทธบาท',
  'ขอให้ครอบครัวร่มเย็นเป็นสุข ปราศจากโรคภัยทั้งปวง',
  'ขอให้การงานก้าวหน้า ค้าขายเจริญรุ่งเรือง ร่ำรวยเงินทอง',
  'ขอให้สมหวังในความรัก ได้พบกัลยาณมิตรที่ดี',
  'ขอให้สอบผ่าน ประสบความสำเร็จในการเรียนและการทำงาน',
  'ขอให้ความทุกข์โศกโรคภัยลอยไปกับสายน้ำ',
  'ขอให้ปีนี้มีแต่สิ่งดีๆ โชคลาภเข้ามาสู่ชีวิต',
  'ขอให้สุขภาพแข็งแรง มีความสุขกายสุขใจตลอดไป',
  'ขอให้สิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาดปลอดภัยทุกทิศ',
  'ขอให้มีชีวิตที่ราบรื่นดั่งสายน้ำที่ไหลเย็น'
];

const STYLES = ['banana_leaf', 'lotus_lamp_gold', 'lotus_lamp_purple', 'royal_swan'];

export class KrathongManager {
  constructor(scene) {
    this.scene = scene;
    this.npcKrathongs = [];
    this.playerKrathongs = [];
    this.latestPlayerKrathong = null;

    this.boundDownstream = 85.0;
    this.boundUpstream = -85.0;

    this.initNPCKrathongs(30);
  }

  initNPCKrathongs(count) {
    for (let i = 0; i < count; i++) {
      const name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
      const wish = NPC_WISHES[Math.floor(Math.random() * NPC_WISHES.length)];
      const style = STYLES[Math.floor(Math.random() * STYLES.length)];

      const z = this.boundUpstream + (i / count) * (this.boundDownstream - this.boundUpstream) + (Math.random() - 0.5) * 6;
      const x = -26 + Math.random() * 22;

      const krathong = new Krathong({
        name,
        wish,
        style,
        isPlayer: false,
        position: new THREE.Vector3(x, 0, z)
      });

      this.scene.add(krathong.group);
      this.npcKrathongs.push(krathong);
    }
  }

  addPlayerKrathong(name, wish, style) {
    const startPos = new THREE.Vector3(-3.2, 0.4, 0);

    const playerKrathong = new Krathong({
      name: name || 'ผู้ร่วมลอยกระทง',
      wish: wish || 'ขอให้มีความสุขความเจริญ',
      style: style || 'banana_leaf',
      isPlayer: true,
      position: startPos
    });

    playerKrathong.driftXSpeed = -0.15;
    playerKrathong.driftSpeed = 0.95;

    this.scene.add(playerKrathong.group);
    this.playerKrathongs.push(playerKrathong);
    this.latestPlayerKrathong = playerKrathong;

    return playerKrathong;
  }

  update(time, delta) {
    for (let i = 0; i < this.npcKrathongs.length; i++) {
      const k = this.npcKrathongs[i];
      k.update(time, delta);

      if (k.group.position.z > this.boundDownstream) {
        k.group.position.z = this.boundUpstream - Math.random() * 8;
        k.group.position.x = -26 + Math.random() * 22;
        k.driftSpeed = 0.75 + Math.random() * 0.45;
        k.driftXSpeed = (Math.random() - 0.5) * 0.08;
      }
    }

    for (let i = 0; i < this.playerKrathongs.length; i++) {
      const pk = this.playerKrathongs[i];
      pk.update(time, delta);

      if (pk.group.position.z > this.boundDownstream) {
        pk.group.position.z = this.boundUpstream;
        pk.group.position.x = -15 + Math.random() * 10;
      }
    }
  }
}
