import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/authz';

const CHARACTERS_FILE = path.join(process.cwd(), 'src/data/characters.json');

const DEFAULT_CHARACTERS = [
  {
      id: 'char_lao_chat',
      name: 'Lão Chat (Mặc định)',
      role: 'lao',
      thumb: '/media/NGHE_zic1jb.webm',
      visualType: 'video',
      assets: {
          idle: '/media/NGHE_zic1jb.webm',
          talking: '/media/NO_I_xx4wc2.webm',
          bowing: null
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      recommendedScale: 1.3,
      recommendedX: 2,
      recommendedY: -3,
      defaultLiveFullScreen: true,
      naturalFacing: 'left'
  },
  {
      id: 'char_lao_lua',
      name: 'Lão Lúa',
      role: 'lao',
      thumb: '/media/Thumbnail_lu_a_nuyekq.png',
      visualType: 'video',
      assets: {
          idle: '/lao_co_nen/noi_16_compressed.mp4',
          talking: '/lao_co_nen/noi_16_compressed.mp4',
          bowing: null
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      recommendedScale: 1.3,
      recommendedX: 2,
      recommendedY: -3,
      defaultLiveFullScreen: true,
      naturalFacing: 'left'
  },
  {
      id: 'char_lao_suoi',
      name: 'Lão Suối',
      role: 'lao',
      thumb: '/media/thumbnail_i2q96w.png',
      visualType: 'video',
      assets: {
          idle: '/lao_co_nen/noi_16_compressed.mp4',
          talking: '/lao_co_nen/noi_16_compressed.mp4',
          bowing: null
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      recommendedScale: 1.3,
      recommendedX: 2,
      recommendedY: -3,
      defaultLiveFullScreen: true,
      naturalFacing: 'left'
  },
  {
      id: 'char_lao_hoa',
      name: 'Lão Hoa',
      role: 'lao',
      thumb: '/lao_co_nen/nghe_hoa.mp4',
      visualType: 'video',
      assets: {
          idle: '/lao_co_nen/nghe_hoa.mp4',
          talking: '/lao_co_nen/noi_hoa.mp4',
          bowing: null
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      recommendedScale: 1.30,
      recommendedX: 2,
      recommendedY: -3,
      defaultLiveFullScreen: true,
      naturalFacing: 'left'
  },
  {
      id: 'char_ba_lao',
      name: 'Bà Lão',
      role: 'user',
      age: 72,
      gender: 'Nữ',
      thumb: '/media/thumbnail_bacu_axubtr.jpg',
      visualType: 'video',
      assets: {
          idle: '/media/ba__cu__nghe_ta_ch_ne__n_gbu24g.webm',
          talking: '/media/ba__cu__no_i_ta_ch_ne__n_q6vnko.webm',
          bowing: '/media/ba__cu__la_y_ta_ch_ne__n_ymupzc.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_be_gai',
      name: 'Bé gái',
      role: 'user',
      age: 9,
      gender: 'Nữ',
      thumb: '/media/begai-thumbnail_eqd4gb.png',
      visualType: 'video',
      assets: {
          idle: '/media/be__ga_i_nghe_ta_ch_ne__n_nwcwcv.webm',
          talking: '/media/be__ga_i_no_i_ta_ch_ne__n_pxtr9e.webm',
          bowing: '/media/be__ga_i_la_y_ta_ch_ne__n_imfmc1.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_ong_lao',
      name: 'Ông lão',
      role: 'user',
      age: 81,
      gender: 'Nam',
      thumb: '/media/ongcu-thumbnail_doqczl.png',
      visualType: 'video',
      assets: {
          idle: '/media/o_ng_cu__nghe_ta_ch_ne__n_eskaip.webm',
          talking: '/media/o_ng_cu__no_i_ta_ch_ne__n_ikz17t.webm',
          bowing: '/media/o_ng_cu__la_y_ta_ch_ne__n_f0ob8h.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_ong_lao_ngoi',
      name: 'Ông lão ngồi',
      role: 'user',
      age: 81,
      gender: 'Nam',
      thumb: '/media/ongcungoi-thumbnail_obeyi5.png',
      visualType: 'video',
      assets: {
          idle: '/media/o_ng_cu__ngo__i_nghe_ky5qfh.webm',
          talking: '/media/o_ng_cu__ngo__i_no_i_apnidy.webm',
          bowing: '/media/o_ng_cu__ngo__i_la_y_tkcgqm.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_ba_lao_ngoi',
      name: 'Bà lão ngồi',
      role: 'user',
      age: 72,
      gender: 'Nữ',
      thumb: '/media/bacungoi-thumbnail_xgueyy.png',
      visualType: 'video',
      assets: {
          idle: '/media/ba__cu__ngo__i_nghe_ta_ch_ne__n_ehswt1.webm',
          talking: '/media/ba__cu__ngo__i_no_i_ta_ch_ne__n_h4nsmq.webm',
          bowing: '/media/ba__cu__ngo__i_la_y_ta_ch_ne__n_ae2aen.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_be_gai_ngoi',
      name: 'Bé gái ngồi',
      role: 'user',
      age: 8,
      gender: 'Nữ',
      thumb: '/media/begaingoi-thumbnail_go9c3o.png',
      visualType: 'video',
      assets: {
          idle: '/media/be__ga_i_ngo__i_nghe_ta_ch_ne__n_dytmmt.webm',
          talking: '/media/be__ga_i_ngo__i_no_i_ta_ch_ne__n_e1gari.webm',
          bowing: '/media/be__ga_i_ngo__i_la_y_ta_ch_ne__n_imfmh8.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_minh',
      name: 'Minh',
      role: 'user',
      age: 29,
      gender: 'Nam',
      thumb: '/media/minh-thumbnail_j5k9sy.png',
      visualType: 'video',
      assets: {
          idle: '/media/nghe_aovtap.webm',
          talking: '/media/no_i_k4i6ts.webm',
          bowing: '/media/la_y_gt19kj.webm'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  },
  {
      id: 'char_thanh_nhu',
      name: 'Thanh Như',
      role: 'user',
      age: 37,
      gender: 'Nữ',
      thumb: '/media/Co__Ga_i_1_rbywhz.jpg',
      visualType: 'video',
      assets: {
          idle: '/media/Nu___A-_Bi_nh_thu_o__ng_kbkj5h.mov',
          talking: '/media/Nu___A-_O_ng_No_i_rxco3f.mov',
          bowing: '/media/Nu___A-_Va_i_La_y_hygeve.mov'
      },
      chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
      naturalFacing: 'right'
  }
];

function loadCharacters() {
  if (!fs.existsSync(CHARACTERS_FILE)) {
    const dir = path.dirname(CHARACTERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(DEFAULT_CHARACTERS, null, 2), 'utf8');
    return DEFAULT_CHARACTERS;
  }
  try {
    const raw = fs.readFileSync(CHARACTERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_CHARACTERS;
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const chars = loadCharacters();
  return NextResponse.json(chars);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.authenticated) {
    return auth.errorResponse || NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array of characters.' }, { status: 400 });
    }
    fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
