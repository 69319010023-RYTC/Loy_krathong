import * as THREE from 'three';

/**
 * 8 Nang Noppamas Contestants & Loy Krathong Cultural Knowledge:
 * - Refined, graceful stylized Thai procedural models
 * - Authentic Thai silk colors, pleated sabai sashes, golden chada tiaras & jewelry
 * - Gentle organic breathing, head bowing, and Wai greeting animation
 * - Cultural Knowledge Base: ประวัติ ที่มา และบทสวดขอขมาพระแม่คงคา วันลอยกระทง
 */

export const LOY_KRATHONG_KNOWLEDGE = [
  {
    num: 1,
    thaiNum: '๑',
    title: 'ตำนานนางนพมาศ (ท้าวศรีจุฬาลักษณ์)',
    subtitle: 'สตรีผู้ริเริ่มประดิษฐ์กระทงดอกบัวแห่งกรุงสุโขทัย',
    colorHex: 0xf472b6, // Rose Pink Silk
    colorSecondary: 0xfbcfe8,
    desc: 'ตามตำรับท้าวศรีจุฬาลักษณ์ พระสนมเอกในสมเด็จพระร่วงเจ้าแห่งกรุงสุโขทัย ได้ทรงคิดประดิษฐ์กระทงเป็นรูป "ดอกบัวกมุท" บานในคืนเพ็ญเดือน ๑๒ เพื่อลอยสักการะรอยพระพุทธบาท สมเด็จพระร่วงเจ้าทรงสรรเสริญและโปรดให้ยึดถือเป็นแบบอย่างประเพณีลอยกระทงสืบมา'
  },
  {
    num: 2,
    thaiNum: '๒',
    title: 'ความหมายของการ "ขอขมาพระแม่คงคา"',
    subtitle: 'สำนึกในพระคุณและขออภัยต่อสายน้ำ',
    colorHex: 0x38bdf8, // Sky Blue Silk
    colorSecondary: 0xbae6fd,
    desc: 'มนุษย์เราอาศัยสายน้ำในการดื่มกิน ทำการเกษตร และดำรงชีวิตมาตลอดทั้งปี การลอยกระทงจึงเป็นการแสดงความกตัญญูกตเวทิตา ขอขมาลาโทษที่ได้ทิ้งสิ่งปฏิกูลลงในแม่น้ำลำคลอง และอัญเชิญพระแม่คงคาคุ้มครองให้ร่มเย็นเป็นสุข'
  },
  {
    num: 3,
    thaiNum: '๓',
    title: 'การบูชารอยพระพุทธบาทริมฝั่งน้ำ',
    subtitle: 'คติความเชื่ออันศักดิ์สิทธิ์ทางพระพุทธศาสนา',
    colorHex: 0x10b981, // Emerald Green Silk
    colorSecondary: 0xd4af37,
    desc: 'ตามคติพุทธศาสนาโบราณ พระสัมมาสัมพุทธเจ้าได้เคยประทับรอยพระพุทธบาทไว้ ณ หาดทรายริมฝั่งแม่น้ำนัมมทานที ประเทศอินเดีย พุทธศาสนิกชนจึงจัดดอกไม้ ธูปเทียน ใส่กระทงลอยลงสู่สายน้ำเพื่อบูชารอยพระพุทธบาทอันศักดิ์สิทธิ์ในคืนวันเพ็ญ'
  },
  {
    num: 4,
    thaiNum: '๔',
    title: 'การลอยเคราะห์ ลอยโศก ปลดปล่อยทุกข์ภัย',
    subtitle: 'ตั้งจิตอธิษฐานเปิดรับสิ่งมงคลสู่ชีวิต',
    colorHex: 0xfacc15, // Golden Yellow Silk
    colorSecondary: 0xd4af37,
    desc: 'ชาวไทยมีความเชื่อแต่โบราณว่า การลอยกระทงคือการปล่อยความทุกข์โศก โรคภัยไข้เจ็บ และสิ่งอัปมงคลต่างๆ ให้ลอยไปกับสายน้ำที่ไหลเชี่ยว พร้อมกับตั้งจิตอธิษฐานขอพรให้ชีวิตมีแต่ความเจริญรุ่งเรืองและพบเจอแต่สิ่งดีงาม'
  },
  {
    num: 5,
    thaiNum: '๕',
    title: 'บทสวดขอขมาพระแม่คงคา (คำบาลี)',
    subtitle: 'สัพพัง อะปะราธัง ขะมะถะ เม ภันเต',
    colorHex: 0xeab308, // Shimmering Gold
    colorSecondary: 0xfef9c3,
    desc: 'นะโม ตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ (๓ จบ)\n"สัพพัง อะปะราธัง ขะมะถะ เม ภันเต อุกาสะ ขะมามิ ภันเต"\nข้าแต่พระแม่คงคา ข้าพเจ้าขอขมาลาโทษต่อสิ่งล่วงเกินทั้งปวง ขอพระแม่คงคาโปรดเมตตาประทานพรให้มีชีวิตที่บริสุทธิ์และร่มเย็น'
  },
  {
    num: 6,
    thaiNum: '๖',
    title: 'ความหมายของ "ธูป ๓ ดอก และเทียน ๑ เล่ม"',
    subtitle: 'แสงประทีปแห่งปัญญาและพระรัตนตรัย',
    colorHex: 0xef4444, // Royal Ruby Red
    colorSecondary: 0xd4af37,
    desc: 'ธูป ๓ ดอก ในกระทง เป็นการบูชาพระรัตนตรัย ได้แก่ พระพุทธ พระธรรม และพระสงฆ์ ส่วนแสงเทียน ๑ เล่ม เป็นดั่งแสงประทีปส่องทาง นำพาปัญญาและความสว่างไสวมาสู่จิตใจ ขจัดความมืดบอดแห่งอวิชชาให้หมดสิ้นไป'
  },
  {
    num: 7,
    thaiNum: '๗',
    title: 'ประเพณียี่เป็งและการปล่อยโคมลอย',
    subtitle: 'พุทธบูชาพระเกศแก้วจุฬามณีบนสรวงสวรรค์',
    colorHex: 0x3b82f6, // Sapphire Blue Silk
    colorSecondary: 0xe2e8f0,
    desc: 'ชาวล้านนามีประเพณีปล่อยโคมลอย (โคมยี่เป็ง) ขึ้นสู่ท้องฟ้าในคืนวันเพ็ญเดือนยี่ เพื่อเป็นพุทธบูชาแด่ "พระเกศแก้วจุฬามณี" พระเจดีย์บนสวรรค์ชั้นดาวดึงส์ที่ประดิษฐานพระเกศาธาตุของพระพุทธเจ้า ถือเป็นสิริมงคลสูงสุด'
  },
  {
    num: 8,
    thaiNum: '๘',
    title: 'คติการก่อเจดีย์ทรายในงานวัด',
    subtitle: 'ขนทรายเข้าวัด ชดเชยดินทราย เสริมบารมี',
    colorHex: 0xa855f7, // Amethyst Purple Silk
    colorSecondary: 0xd4af37,
    desc: 'การก่อเจดีย์ทรายในเทศกาลวันเพ็ญเดือน ๑๒ เพื่อเป็นการนำเศษทรายกลับมาคืนวัด ชดเชยทรายที่อาจติดฝ่าเท้าออกจากวัดตลอดทั้งปี ทรายที่นำมาจะถูกใช้บูรณปฏิสังขรณ์เสนาสนะ ทั้งยังเป็นการสร้างความสามัคคีร่วมแรงร่วมใจของชุมชน'
  }
];

export class ContestantsGroup {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    // Position on stage deck (x: 28, y: 3.02, z: -5.0)
    this.group.position.set(28, 3.02, -5.2);
    this.scene.add(this.group);

    this.contestantNodes = [];
    this.initContestants();
  }

  initContestants() {
    const totalSpacing = 20.0;
    const startX = -totalSpacing / 2;
    const stepX = totalSpacing / 7;

    LOY_KRATHONG_KNOWLEDGE.forEach((data, index) => {
      const posX = startX + index * stepX;
      const node = this.buildContestant(data, index);
      node.group.position.set(posX, 0, 0);
      this.group.add(node.group);
      this.contestantNodes.push(node);
    });
  }

  buildContestant(data, index) {
    const contestantGroup = new THREE.Group();

    // Materials - Radiant Thai Silk & Jewelry
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffe8d6, // Delicate fair porcelain Thai skin
      roughness: 0.6,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.35
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85
    });

    const silkDressMat = new THREE.MeshStandardMaterial({
      color: data.colorHex,
      roughness: 0.4,
      metalness: 0.15
    });

    const sabaiMat = new THREE.MeshStandardMaterial({
      color: data.colorSecondary === 0xd4af37 ? 0xd4af37 : data.colorSecondary,
      roughness: 0.35,
      metalness: data.colorSecondary === 0xd4af37 ? 0.8 : 0.2,
      side: THREE.DoubleSide
    });

    // 1. Lower Body: Elegant Thai Wrap Sarong (ผ้าซิ่นยกทองจีบหน้านาง)
    const skirtGeo = new THREE.CylinderGeometry(0.22, 0.34, 1.35, 16);
    skirtGeo.scale(1.1, 1, 0.85);
    const skirt = new THREE.Mesh(skirtGeo, silkDressMat);
    skirt.position.y = 0.68;
    skirt.castShadow = true;
    contestantGroup.add(skirt);

    // Gold hem border (เชิงซิ่น)
    const hemGeo = new THREE.CylinderGeometry(0.342, 0.35, 0.16, 16);
    hemGeo.scale(1.1, 1, 0.85);
    const hem = new THREE.Mesh(hemGeo, goldMat);
    hem.position.y = 0.08;
    contestantGroup.add(hem);

    // Front pleated flap (จีบหน้านาง)
    const pleatGeo = new THREE.BoxGeometry(0.14, 1.25, 0.06);
    const pleat = new THREE.Mesh(pleatGeo, sabaiMat);
    pleat.position.set(0, 0.65, 0.3);
    contestantGroup.add(pleat);

    // Golden Royal Belt (เข็มขัดทองและปั้นเหน่ง)
    const beltGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.07, 16);
    beltGeo.scale(1.12, 1, 0.88);
    const belt = new THREE.Mesh(beltGeo, goldMat);
    belt.position.y = 1.34;
    contestantGroup.add(belt);

    const buckleGeo = new THREE.SphereGeometry(0.055, 8, 8);
    buckleGeo.scale(1.4, 1, 0.5);
    const buckle = new THREE.Mesh(buckleGeo, goldMat);
    buckle.position.set(0, 1.34, 0.27);
    contestantGroup.add(buckle);

    // 2. Torso (Bodice with Sabai wrap)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.35, 0);

    const torsoGeo = new THREE.CylinderGeometry(0.21, 0.22, 0.72, 16);
    torsoGeo.scale(1.08, 1, 0.82);
    const torso = new THREE.Mesh(torsoGeo, silkDressMat);
    torso.position.y = 0.36;
    torso.castShadow = true;
    torsoGroup.add(torso);

    // Pleated Sabai Sash diagonal wrap
    const sabaiCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, 0.05, 0.2),
      new THREE.Vector3(0.12, 0.38, 0.22),
      new THREE.Vector3(-0.16, 0.65, 0.12),
      new THREE.Vector3(-0.18, 0.45, -0.2),
      new THREE.Vector3(-0.19, -0.4, -0.22)
    ]);
    const sabaiTubeGeo = new THREE.TubeGeometry(sabaiCurve, 16, 0.075, 8, false);
    const sabaiTube = new THREE.Mesh(sabaiTubeGeo, sabaiMat);
    torsoGroup.add(sabaiTube);

    // Trailing sabai cloth down the back
    const flapGeo = new THREE.PlaneGeometry(0.26, 1.35);
    flapGeo.rotateY(Math.PI);
    const flap = new THREE.Mesh(flapGeo, sabaiMat);
    flap.position.set(-0.18, 0.05, -0.23);
    torsoGroup.add(flap);

    // Golden Royal Necklace (กรองคอทอง)
    const neckCollarGeo = new THREE.TorusGeometry(0.12, 0.02, 6, 12);
    neckCollarGeo.rotateX(Math.PI / 2.3);
    const necklace = new THREE.Mesh(neckCollarGeo, goldMat);
    necklace.position.set(0, 0.62, 0.08);
    torsoGroup.add(necklace);

    // Contestant Sash across chest
    const sashCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 0.66, 0.08),
      new THREE.Vector3(0, 0.38, 0.22),
      new THREE.Vector3(0.2, 0.08, 0.18)
    ]);
    const sashGeo = new THREE.TubeGeometry(sashCurve, 8, 0.035, 6, false);
    const sashMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const sashMesh = new THREE.Mesh(sashGeo, sashMat);
    torsoGroup.add(sashMesh);

    // 3. Arms & Hands in traditional Thai Wai (พนมมือไหว้งดงาม)
    const waiGroup = new THREE.Group();
    waiGroup.position.set(0, 0.42, 0.24);

    [-0.23, 0.23].forEach((ax) => {
      const armGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.38, 8);
      const arm = new THREE.Mesh(armGeo, skinMat);
      arm.position.set(ax * 0.9, 0.12, -0.06);
      arm.rotation.z = ax > 0 ? 0.45 : -0.45;
      arm.rotation.x = -0.55;
      waiGroup.add(arm);

      // Gold Bangle
      const bangleGeo = new THREE.TorusGeometry(0.046, 0.012, 6, 10);
      const bangle = new THREE.Mesh(bangleGeo, goldMat);
      bangle.position.set(ax * 0.4, -0.02, 0.08);
      waiGroup.add(bangle);
    });

    // Joined Palms (ฝ่ามือพนมดอกบัวตูม)
    const palmsGeo = new THREE.ConeGeometry(0.062, 0.24, 8);
    palmsGeo.scale(0.7, 1, 0.4);
    const palms = new THREE.Mesh(palmsGeo, skinMat);
    palms.position.set(0, 0.06, 0.06);
    waiGroup.add(palms);

    torsoGroup.add(waiGroup);

    // 4. Head & Face & Golden Chada Tiara
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.78, 0);

    const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.18, 10);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.08;
    headGroup.add(neck);

    const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
    headGeo.scale(0.9, 1.15, 0.95);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.28;
    headGroup.add(head);

    // Thai Hair Bun (มวยผมเรียบหรู)
    const hairGeo = new THREE.SphereGeometry(0.17, 16, 16);
    hairGeo.scale(0.95, 1.15, 1.05);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.32, -0.04);
    headGroup.add(hair);

    const bunGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const bun = new THREE.Mesh(bunGeo, hairMat);
    bun.position.set(0, 0.42, -0.12);
    headGroup.add(bun);

    // Golden Chada Tiara / Dok-Mai-Wai (ชฎา / ดอกไม้ไหวสีทอง)
    const tiaraGeo = new THREE.ConeGeometry(0.08, 0.32, 8);
    const tiara = new THREE.Mesh(tiaraGeo, goldMat);
    tiara.position.set(0, 0.56, 0.02);
    headGroup.add(tiara);

    // Earrings
    [-0.15, 0.15].forEach((ex) => {
      const earringGeo = new THREE.SphereGeometry(0.025, 6, 6);
      const earring = new THREE.Mesh(earringGeo, goldMat);
      earring.position.set(ex, 0.24, 0);
      headGroup.add(earring);
    });

    torsoGroup.add(headGroup);
    contestantGroup.add(torsoGroup);

    // 5. 3D Billboard Plaque
    const plaqueSprite = this.createKnowledgePlaque(data);
    plaqueSprite.position.set(0, 3.1, 0);
    contestantGroup.add(plaqueSprite);

    return {
      group: contestantGroup,
      torsoGroup: torsoGroup,
      headGroup: headGroup,
      waiGroup: waiGroup,
      baseHandY: waiGroup.position.y,
      data: data,
      index: index,
      phase: index * 0.785
    };
  }

  createKnowledgePlaque(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 24, 40, 0.88)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 5;

    const x = 12, y = 12, w = 488, h = 166, r = 22;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`นางนพมาศ หมายเลข ${data.thaiNum}`, 256, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Sarabun, sans-serif';
    ctx.fillText(data.title, 256, 102);

    ctx.fillStyle = '#f472b6';
    ctx.font = 'italic 19px Sarabun, sans-serif';
    ctx.fillText(data.subtitle, 256, 142);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.4, 0.89, 1);
    return sprite;
  }

  update(time, delta) {
    for (let i = 0; i < this.contestantNodes.length; i++) {
      const node = this.contestantNodes[i];
      const ph = node.phase;

      // 1. Torso gentle body sway
      const swayY = Math.sin(time * 1.3 + ph) * 0.07;
      const swayZ = Math.cos(time * 1.3 + ph) * 0.03;
      node.torsoGroup.rotation.y = swayY;
      node.torsoGroup.rotation.z = swayZ;

      // 2. Head graceful bow
      const bow = Math.sin(time * 1.3 + ph) * 0.055;
      node.headGroup.rotation.x = Math.max(0, 0.035 + bow);
      node.headGroup.rotation.y = Math.sin(time * 0.9 + ph) * 0.045;

      // 3. Hands lifting in Wai gesture
      const handWave = Math.sin(time * 1.3 + ph) * 0.03;
      node.waiGroup.position.y = node.baseHandY + handWave;

      // 4. Subtle knees curtsy / dip
      node.group.position.y = Math.sin(time * 2.6 + ph) * 0.018;
    }
  }
}
