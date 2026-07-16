-- ========================================================
-- SAO LƯU CƠ SỞ DỮ LIỆU 'onglao' (PostgreSQL DUMP)
-- Thời gian tạo: 10:10:26 22/6/2026
-- ========================================================

-- Tạm thời bỏ qua kiểm tra khóa ngoại để dọn dẹp và nạp dữ liệu sạch sẽ
SET session_replication_role = 'replica';

-- DỌN DẸP DỮ LIỆU CŨ
TRUNCATE TABLE "UserFavorite", "ChatMessage", "ChatSession", "User", "Stanza", "Poem", "KnowledgeBase", "VoiceStyle", "BackgroundMusic", "PromptTemplate" RESTART IDENTITY CASCADE;

-- NẠP DỮ LIỆU BẢNG User

-- NẠP DỮ LIỆU BẢNG KnowledgeBase
INSERT INTO "KnowledgeBase" ("id", "category", "question", "answer", "createdAt", "updatedAt") VALUES ('f2cd23f0-bd57-4c76-bb62-da350b348152', 'Triết lý sống', 'vô minh là gì, làm sao thoát vô minh, đau khổ', 'Vô minh là không thấy được bản chất thật của các pháp là mộng ảo, vô thường. Cứ chấp vào cái tôi giả tạm nên sinh ra phiền não. Thoát vô minh không phải là diệt trừ gì cả, mà là trực nhận Tánh Giác (thấy nghe nói biết) vốn thanh tịnh ngay hiện tiền.', '2026-06-16T03:08:14.789Z', '2026-06-16T03:08:14.789Z');
INSERT INTO "KnowledgeBase" ("id", "category", "question", "answer", "createdAt", "updatedAt") VALUES ('2ba4d5d1-6a1b-4ad8-a6e0-3e2c4206845a', 'Triết lý sống', 'tánh phật, bản thể chân thật, pháp thân', 'Bản thể chân thật không sinh không diệt, không cấu không tịnh. Nó vượt ngoài mọi trạng thái cảm xúc. Đừng lầm tưởng an lạc là bản thể. Bản thể là cái KHÔNG tĩnh lặng chứa đựng mọi thứ. Hành không dính mắc tức là đang ở bản thể.', '2026-06-16T03:08:14.793Z', '2026-06-16T03:08:14.793Z');

-- NẠP DỮ LIỆU BẢNG Poem
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('935937c5-d892-4457-8f21-7a8b37f0b3bf', 'Bài 1: Tam vô', '2026-06-16T03:08:14.823Z', '2026-06-16T03:08:14.823Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('794efa99-17e5-4ffd-af71-2f58873ab853', 'Bài 2: Tam vô', '2026-06-16T03:08:14.842Z', '2026-06-16T03:08:14.842Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('15464ddd-a8d3-4592-8514-ef98342e8f4f', 'Vô tướng', '2026-06-16T03:08:14.853Z', '2026-06-16T03:08:14.853Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('38cf1dd3-2d73-48e8-b677-b38d850af6d6', 'Vô niệm', '2026-06-16T03:08:14.864Z', '2026-06-16T03:08:14.864Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f697dd1e-2992-4ac3-aaa4-544f0553e889', 'Nó Không Là Gì Cả', '2026-06-16T03:08:14.874Z', '2026-06-16T03:08:14.874Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5265f46a-1c17-431a-87a7-9f283b563a77', 'Bài 4: Dạo hành', '2026-06-16T03:08:14.884Z', '2026-06-16T03:08:14.884Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('eb3c851a-a5a7-44b6-9166-12ed159acf6c', 'Bài 5: Dạo mùa', '2026-06-16T03:08:14.893Z', '2026-06-16T03:08:14.893Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('14f8768e-8dbf-438f-98c4-b2ceeb6aec31', 'Bài 6: Tìm Phật', '2026-06-16T03:08:14.903Z', '2026-06-16T03:08:14.903Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('b2c7d692-44d0-4e02-8723-2c648f4a4c52', 'Bài 7: Thấy mình', '2026-06-16T03:08:14.911Z', '2026-06-16T03:08:14.911Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7a5d7821-7b41-41eb-a9b7-afbd131f82cb', 'Bài 3: Biết Sắc Âm Đều Giả', '2026-06-16T03:08:14.921Z', '2026-06-16T03:08:14.921Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7a82f1e6-0681-4d56-a1d4-209eb3301fa0', 'Bài 8: Rõ mình', '2026-06-16T03:08:14.936Z', '2026-06-16T03:08:14.936Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3f9e2d73-e865-46c9-af9a-931382ac3e54', 'Bài 11: Ta ở đâu', '2026-06-16T03:08:14.945Z', '2026-06-16T03:08:14.945Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('9ad8e147-269e-4882-8675-a6501cca4bf6', 'Bài 12: Tôn chỉ', '2026-06-16T03:08:14.952Z', '2026-06-16T03:08:14.952Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('114a22eb-fbd1-48ff-8609-0c50aa7b0f8b', 'Bài 3: Diệt Chín Loài Chúng Sanh – Bất Kiến Chúng Diệt Độ', '2026-06-16T03:08:14.960Z', '2026-06-16T03:08:14.960Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('1ee01e99-605a-4fc9-a370-0919228b7723', 'Bài 13: Giới quy', '2026-06-16T03:08:14.967Z', '2026-06-16T03:08:14.967Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('45e86109-1ae3-4529-9589-9e54e2c6eb69', 'Bài 14: Cương lĩnh', '2026-06-16T03:08:14.974Z', '2026-06-16T03:08:14.974Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Bài 15: Lời vàng', '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('158979a7-a55b-4f3d-9636-60a93a8acdbf', 'Bài 16: Thuyền bát nhã', '2026-06-16T03:08:14.991Z', '2026-06-16T03:08:14.991Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7e86c391-6802-4684-ade1-e3ba241f86dc', 'Bài 18: Thiền', '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('b5403677-1ce4-4f41-ad3b-618164d9caa0', 'Bài 19: Niệm phật', '2026-06-16T03:08:15.005Z', '2026-06-16T03:08:15.005Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('31770b75-041c-49c4-9839-c8cd0df5e82d', 'Bài 20: A di đà Phật', '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('df0e866e-3ff8-4f09-86e8-391b6e7a1e62', 'Bài 5: Phương Pháp Thực Hành: Buông - Dừng - Thôi', '2026-06-16T03:08:15.023Z', '2026-06-16T03:08:15.023Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f4dc0d6a-1629-4b9b-a460-0e4d1b209bfc', 'Bài 26: ĐÃ NHẬN', '2026-06-16T03:08:15.029Z', '2026-06-16T03:08:15.029Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3387c727-1bae-40e6-846d-2d1b612f1986', 'Bài 27: CHƯ PHẬT DẠY', '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('de7a7296-e864-454d-83c7-7b24bd437c8f', 'Bài 28: PHÓNG SANH', '2026-06-16T03:08:15.040Z', '2026-06-16T03:08:15.040Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8a5ccbaf-a92b-4776-976d-72b7de871272', 'Bài 29: CẢM NIỆM NHƯ LAI', '2026-06-16T03:08:15.045Z', '2026-06-16T03:08:15.045Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('98ab5615-a196-4971-a0ba-4cfaca685343', 'Bài 30: CẢM NIỆM PHẬT MẪU QUÁN THẾ ÂM', '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a9029b15-b5d0-4d1d-b10d-cdc2d897749e', '..........', '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('947511c4-9897-4cf6-a881-78bfd087acfe', 'Bài 33: Duyên an vị Phật', '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7b7f28cc-506a-420c-99fd-b76b06d36550', 'Bài 34: Phật cũng gặp nạn', '2026-06-16T03:08:15.070Z', '2026-06-16T03:08:15.070Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('30d40f6c-246a-44db-b578-91260b1c4532', 'Bài 35: Tam Vô đại nguyện', '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('1660a340-9bef-48c6-9061-0e441cf938fb', 'Bài 40: Duyên xuất thế', '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a0930233-dd8b-4ae5-80da-5555c91b8951', 'Bài 41: Nếu một ngày con mệt mỏi', '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f376c07f-a165-4919-8660-84257b818cab', 'Bài 42: Bèo tìm bến', '2026-06-16T03:08:15.096Z', '2026-06-16T03:08:15.096Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('96194a43-496f-49ae-b876-7fb6abbd2951', 'Bài 3: ', '2026-06-16T03:08:15.101Z', '2026-06-16T03:08:15.101Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('89550811-8d8c-4dee-9ea5-8c9c180db831', 'Bài 5: ', '2026-06-16T03:08:15.108Z', '2026-06-16T03:08:15.108Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Bài 43: THỨ GÌ', '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('fa68520a-8709-4e42-a8c1-213efcc5b055', 'Bài 44: NGUYỆN CHO CON CHÁU', '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Bài 45: KÍNH TẶNG MẸ', '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c633c61c-d448-4212-b0fd-9d82fc825205', 'Bài 46: LỜI CHỈ BÀY', '2026-06-16T03:08:15.139Z', '2026-06-16T03:08:15.139Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Bài 49: TRƯỜNG XUÂN', '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('0cb64235-f705-4b5a-bcd3-625bde1b75bf', 'Bài 50: ĐẠI DUYÊN(Ý NHƯ)', '2026-06-16T03:08:15.151Z', '2026-06-16T03:08:15.151Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Bài 51: HÀNH TRÌNH VỀ CHA(Ý NHƯ)', '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('45abd0c0-783e-48e9-b960-f89031aa0888', 'Bài 52: GẶP NGƯỜI KHAI NGỘ(Ý NHƯ)', '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Bài 53: CẢM NIỆM ÂN CHA(Ý NHƯ)', '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('901d97a4-74f8-43f8-9b0e-dc36af81e440', 'Bài 54: TÌM LẦU ĐÀI', '2026-06-16T03:08:15.175Z', '2026-06-16T03:08:15.175Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('b994939d-2782-49ff-9d18-4749fc30a74e', 'Bài 55: BÌNH MINH', '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Bài 56: SỐNG TỰ TẠI', '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8efda14c-2927-4679-b99a-3cc26e0e0770', 'Bài 57: Duyên hành', '2026-06-16T03:08:15.193Z', '2026-06-16T03:08:15.193Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Bài 58: HIỂU BIẾT MỚI YÊU THƯƠNG', '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('90063882-ead1-4250-b12d-c1976495bce9', 'Bài 59: THÀNH THẬT CHÂN THẬT', '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('77d1f3d4-afd2-4b0e-b1e9-124ebdb3681e', 'Bài 60: ĐẠO CẢM THÔNG', '2026-06-16T03:08:15.213Z', '2026-06-16T03:08:15.213Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('bc7aa7d8-1d5a-4e82-ad77-aa91b88a5179', 'Bài 61: CHÀNG CÙNG TỬ', '2026-06-16T03:08:15.218Z', '2026-06-16T03:08:15.218Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('27782196-b6ed-4594-9394-600035a32ed0', 'QUYẾT TÂM KHÔNG NHẬN NGƯỜI NHÀ', '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('885b68c8-843a-4a72-9b07-12dd23e6041b', 'Bài 62: THÔI TU THÔI CHỨNG', '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Bài 63: PHÁ TƯỚNG', '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Bài 64: NỖI NIỀM CON TRẺ KÍNH CHA (HUỆ TỊNH)', '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Bài 65: VỀ NHÀ CÙNG CHA(HUỆ TỊNH)', '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('b66dff59-6a70-4bd9-9f48-fd5b709576dd', 'Bài 66: Vọng tưởng', '2026-06-16T03:08:15.247Z', '2026-06-16T03:08:15.247Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Bài 67: VÔ CHỨNG', '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Bài 68: BẤT VỌNG ĐỘ', '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Bài 69: TẠI - VÌ -DO - BỞI -TRẦN -CẤU', '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3b6acf53-104d-44ec-921c-45d6ec9d4435', 'Bài 70: Soi mói', '2026-06-16T03:08:15.271Z', '2026-06-16T03:08:15.271Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d3ceb3c6-a72d-4196-ac18-3a9d574086a7', 'Bài 71: Cẩn thận kẻo lầm', '2026-06-16T03:08:15.276Z', '2026-06-16T03:08:15.276Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f0aec85b-a166-4d07-8f26-b259c2479667', 'Bài 72: CỦA MÌNH', '2026-06-16T03:08:15.283Z', '2026-06-16T03:08:15.283Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a4e4cc7f-9366-4137-8a1c-811500a0acf8', 'Bài 73: BÁT CHÁO HÀNH', '2026-06-16T03:08:15.288Z', '2026-06-16T03:08:15.288Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Bài 74: ĐỊA NGỤC BẤT VỊ KHÔNG', '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Bài 75: UỐNG NƯỚC HẾT BỆNH', '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Bài 76: TRỞ VỀ(TỊNH CHÂU)', '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Bài 77: CẢM NIỆM ÂN SƯ CHA(TỊNH CHÂU)', '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('7553195f-750c-49cd-a982-59c4bb1d03dc', 'Bài 78: MỘT CHUYẾN VỀ NHÀ(TỊNH CHÂU)', '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('07e84257-d983-4586-8ded-2c116666aca7', 'Bài 79: CÚNG CHƠN TÁNH', '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('e4a52c22-926f-49ca-910f-68282c5a7200', 'Bài 80: KIẾP CON CUA', '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Bài 81: TÔM HÓA RỒNG', '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Bài 82: CHUYỆN ĐÔI ĐŨA', '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5212bb30-ae19-4625-81e9-50e31d05813b', 'Bài 83: CẦU ĐẠO', '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Bài 84: TÌM CẦU', '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('fab8db39-3ce7-4562-beda-b5c4878d2600', 'Bài 85: THỆ NGUYỆN', '2026-06-16T03:08:15.354Z', '2026-06-16T03:08:15.354Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Bài 86: THOÁT MÊ LẦM', '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('aab80829-f66d-4157-bc76-a68561e6369c', 'Bài 87: THOÁT MÊ', '2026-06-16T03:08:15.363Z', '2026-06-16T03:08:15.363Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('58514505-31e9-443f-bf06-3c21488e9849', 'Bài 88: THOÁT NẠN', '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('e75ebcc3-d6ff-413a-ae82-5f7d3ca4ab96', 'Bài 89: ĐẠI DUYÊN GẶP NGƯỜI(HUỆ QUANG)', '2026-06-16T03:08:15.372Z', '2026-06-16T03:08:15.372Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Bài 90: CẢM NIỆM ÂN NGƯỜI ĐÃ ĐỘ CON(HUỆ QUANG)', '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('9c939dc6-197d-4013-975f-eb005e00432e', 'Bài 91: ÂN CHA (HUỆ QUANG)', '2026-06-16T03:08:15.381Z', '2026-06-16T03:08:15.381Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d6205cf8-9cda-451b-9b99-149d44a79f0d', 'Bài 92: AN GIA', '2026-06-16T03:08:15.385Z', '2026-06-16T03:08:15.385Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c3caea77-3d67-4512-981a-296e2985f9e0', 'Bài 93: TÌM AN', '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('009b16d6-e843-4841-abc7-a5690a829abb', 'Bài 94: NGƯỜI GIÀU', '2026-06-16T03:08:15.395Z', '2026-06-16T03:08:15.395Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('411045ae-1663-4fa6-ba51-eb5f0019fa57', 'Bài 95: NGUYỆN CHO CON TRẺ', '2026-06-16T03:08:15.401Z', '2026-06-16T03:08:15.401Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('847741d2-7b77-432e-a057-3373e79d5a1f', 'Bài 96: TÂM NGHI', '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Bài 97: NGẮM TRĂNG', '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Bài 98: ÔNG LÃO TRONG RỪNG', '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('29063742-bc44-4137-bb75-7e1fd0f4217d', 'Bài 99: CON CHI', '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('458d01a0-7da6-4a9e-9308-a9ba1b93ebf7', 'Bài 100: VÔ NHẪN', '2026-06-16T03:08:15.433Z', '2026-06-16T03:08:15.433Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('cd62edba-ce53-4790-83be-7619c4db5b21', 'Bài 101: THỦ PHẤT', '2026-06-16T03:08:15.439Z', '2026-06-16T03:08:15.439Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Bài 102: BUỔI ĐẦU GẶP CHA TRÊN SÓNG(HẰNG TỊNH)', '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Bài 103: CON  THƯA CHA (HẰNG TỊNH)', '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('94a5362b-aa28-47ea-a819-0bda8e3f5d2f', 'Bài 104: KHAI ĐẠO', '2026-06-16T03:08:15.457Z', '2026-06-16T03:08:15.457Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6bf5b087-f024-4fbc-9de6-14876d61f669', 'Bài 110: NHÀ Ở ĐÂU', '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3c2ca326-4fcc-47ef-9e74-6c1980b446b7', 'Bài 111: DIỆU LIÊN', '2026-06-16T03:08:15.465Z', '2026-06-16T03:08:15.465Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Bài 112: ĐỒNG TIỀN', '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Bài 113: ĐẠI DUYÊN XUỐNG TÓC', '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Bài 114: TRỞ VỀ ( TRƯỜNG ĐĂNG)', '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('99be5dec-ea1d-4248-b4e4-9db0d7aa8995', 'Bài 115: TỰ TÂM  ( BẤT ĐỘ )', '2026-06-16T03:08:15.495Z', '2026-06-16T03:08:15.495Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Bài 116: ĐƯỜNG VỀ NHÀ(MINH CHÂU)', '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Bài 117: BẠCH NGÔN', '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('24c2d075-7b06-4822-b009-6999fefb9043', 'Bài 118: BUÔNG VAY TRẢ', '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8055009e-e982-4585-aafd-9555b094a976', 'Bài 119: QUÊN GIỜ VÀNG', '2026-06-16T03:08:15.543Z', '2026-06-16T03:08:15.543Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Bài 120: HẠNH SÁM HỐI', '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d0d3a077-6645-4275-ba33-1a6dfc92cbf1', 'Bài 121: NGUYỆN CHO TRẺ EM VỪA RA ĐỜI', '2026-06-16T03:08:15.561Z', '2026-06-16T03:08:15.561Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('6e57e4df-af6b-40d1-994c-5c1a0682d031', 'Bài 122: OÁN HƯ', '2026-06-16T03:08:15.571Z', '2026-06-16T03:08:15.571Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('815891d4-9256-4bee-bdac-7510e7577322', 'Bài 123: NGƯỜI CON THỨC TỈNH', '2026-06-16T03:08:15.582Z', '2026-06-16T03:08:15.582Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Bài 124: TỈNH GIÁC XUỐNG TÓC', '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Bài 125: CÚNG SIÊU THOÁT', '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Bài 126: LỜI NHẮC NHỞ', '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('cb2c9647-2c75-4620-abbd-d503411348c4', 'Bài 128: CON CHÁU THỈNH CẦU', '2026-06-16T03:08:15.614Z', '2026-06-16T03:08:15.614Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5f0889c6-4747-43bb-ac9d-5fd27364bdba', 'Bài 129: NGUYỆN CHO CON CHÁU TỈNH NGỘ', '2026-06-16T03:08:15.620Z', '2026-06-16T03:08:15.620Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5054f66e-69a6-48e3-80a8-b254488a9ec1', 'Bài 130: NGUYỆN CON CHÁU VIÊN MÃN', '2026-06-16T03:08:15.623Z', '2026-06-16T03:08:15.623Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('598a58c9-b421-498b-a64c-f33ae480668a', 'Bài 131: CẦU TÂM AN', '2026-06-16T03:08:15.628Z', '2026-06-16T03:08:15.628Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3bb0e604-e291-4b19-bb71-b3afa53dfbb4', 'Bài 132: HIẾU ĐẠO', '2026-06-16T03:08:15.632Z', '2026-06-16T03:08:15.632Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('009b259c-cea8-43da-99d0-69d6e3253de0', 'Bài 133: TAM VÔ HẰNG NHẬT', '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d7dae3ee-8284-4125-947f-b478812720d8', 'Bài 134: HẠNG NGƯỜI ĐÁNG KÍNH', '2026-06-16T03:08:15.644Z', '2026-06-16T03:08:15.644Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('cbe9f225-6d36-4d31-ac7e-91cc817e61b4', 'Bài 135: LÀNH THAY CON CHÁU RÕ ĐÀNG', '2026-06-16T03:08:15.649Z', '2026-06-16T03:08:15.649Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a1dc1ae0-b8ea-41b8-bab4-f150b4be1701', 'Bài 136: LÃO ĐÒ', '2026-06-16T03:08:15.653Z', '2026-06-16T03:08:15.653Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Bài 137: TẠI SAO YÊU QUÁI THÍCH ĂN THỊT ĐƯỜNG TĂNG?', '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('9034bd91-45da-4337-8b07-6c6f2ce87fb3', 'Bài 138: LÃO BẨN LÃO BẦN', '2026-06-16T03:08:15.663Z', '2026-06-16T03:08:15.663Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Bài 139: SỐ ĐẠO', '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('d602635e-4266-446c-98eb-582a508be2f5', 'Bài 140: CON CHÁU KÍNH NGÀY THỊ HIỆN', '2026-06-16T03:08:15.674Z', '2026-06-16T03:08:15.674Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('48ab2e38-745b-4c9b-ab7e-1d5390bd9c72', 'Bài 141: VẢ NGỘ', '2026-06-16T03:08:15.680Z', '2026-06-16T03:08:15.680Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('67a5e552-0e87-4701-95d0-6f63c5827640', 'Bài 142: HÀNH NƠI THÌNH LÌNH', '2026-06-16T03:08:15.685Z', '2026-06-16T03:08:15.685Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c650b625-0c8b-4d5f-912d-f2c42fa0b77d', 'Bài 143: HOÀN TRẢ BỤI HỒNG', '2026-06-16T03:08:15.692Z', '2026-06-16T03:08:15.692Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c2ed57c8-be12-4fa1-bfba-76ff20e1220c', 'Bài 144: NĂM MƯỜI', '2026-06-16T03:08:15.696Z', '2026-06-16T03:08:15.696Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Bài 145: CHIM CHI', '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('73045457-3607-41cf-a642-1cb9d3694497', 'Bài 146: TU HÚ', '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('608bce72-616d-4d1e-a072-55f5c13a3ab3', 'Bài 147: THỦ ĐÀ', '2026-06-16T03:08:15.712Z', '2026-06-16T03:08:15.712Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('580eadf8-6c57-4d41-92ee-afcdc9de04e8', 'Bài 148: GIAN TRUÂN THỈNH MẸ', '2026-06-16T03:08:15.718Z', '2026-06-16T03:08:15.718Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('ad80e984-5814-4b9e-b79e-1d9c690d26a6', 'Bài 149: CỎ HOA ĐƯỜNG', '2026-06-16T03:08:15.723Z', '2026-06-16T03:08:15.723Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Bài 150: ĐẠO LỬA TRỜI', '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('90d1e116-7a9c-4204-991f-5532306cf871', 'Bài 151: GÀ LANG THANG', '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Bài 152: ĐẠI NHÂN DUYÊN', '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('5c5951aa-7547-4de1-81ea-e506a0cc2468', 'Bài 153: ĐẠO CỰC', '2026-06-16T03:08:15.758Z', '2026-06-16T03:08:15.758Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('106bb32f-681d-4690-b8dc-f05cf3e30666', 'Bài 154: ĂN UỐNG THANH ĐẠM', '2026-06-16T03:08:15.763Z', '2026-06-16T03:08:15.763Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f4cd26e6-525b-48fd-a75c-1eda1776627f', 'Bài 155: ĐÁNH CHUÔNG GÕ MÕ NIỆM PHẬT TRÌ CHÚ TỤNG KINH', '2026-06-16T03:08:15.769Z', '2026-06-16T03:08:15.769Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('590c11e2-b3f7-4349-ac52-61e33090b762', 'Bài 156: KIM CHỈ ĐỒ', '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Bài 159: TRÙM LỪA ĐẢO HAI LỜI', '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('3486ffb9-144e-49e2-afe4-a868795e1d90', 'Bài 160: TÌM ĐƯỜNG', '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('dfff23e8-9457-4239-9554-da5d318c0545', 'Bài 161: CHÂN ÁI', '2026-06-16T03:08:15.797Z', '2026-06-16T03:08:15.797Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('640d4402-e0f0-47a1-ac02-f65f0aeea36b', 'Bài 162: RẢI XÁ LỢI', '2026-06-16T03:08:15.805Z', '2026-06-16T03:08:15.805Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('52404987-d31b-4a2e-93f1-a087a5d62e2d', 'Bài 163: ĐỒNG NHẤT DẠ', '2026-06-16T03:08:15.814Z', '2026-06-16T03:08:15.814Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Bài 164: CẢM NIỆM BỒ TÁT CHƯ THIÊN CHƯ THẦN CHƯ THÁNH', '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('47b26eb9-3fd0-4b3d-99b7-49a11e5aa02e', 'Bài 1: TẶNG PHỤ NỮ', '2026-06-16T03:08:15.828Z', '2026-06-16T03:08:15.828Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('8ea60bd4-4933-40b3-b710-9f1a3e50160f', 'Bài 2: Xuân', '2026-06-16T03:08:15.834Z', '2026-06-16T03:08:15.834Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('51bf1630-03b3-4f68-af1b-7eb332f96217', 'Bài 3: TẾT NGUYỆN', '2026-06-16T03:08:15.839Z', '2026-06-16T03:08:15.839Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('86114a57-9bb9-43bc-95d6-29f8d65b8462', 'Bài 4: MỪNG TẾT', '2026-06-16T03:08:15.844Z', '2026-06-16T03:08:15.844Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Bài 5: Tết xuân', '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Bài 6: Kính lễ Phật đản', '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('0bdf2935-9449-41d4-a73d-871941a4c433', 'Bài 7: THÁNG BẢY', '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('98d4f524-1d8c-415a-8972-782deab33afd', 'Bài 8: CON CHÁU HIẾU KÍNH ĐẠI LỄ VU LAN', '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('78f81b09-c569-4508-8d8c-ff2191e12317', 'Bài 9: ĐẠI LỄ VU LAN SÁM HỐI', '2026-06-16T03:08:15.911Z', '2026-06-16T03:08:15.911Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('19099ab5-633f-4ac9-b90e-05733d39fe5a', 'Bài 10: 20/11 NGUYỆN', '2026-06-16T03:08:15.917Z', '2026-06-16T03:08:15.917Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Bài 11: VU LAN KÍNH HIẾU(THANH NHƯ)', '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Bài 12: LÒNG CON KÍNH HIẾU(Ý NHƯ)', '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('b26a09cd-bb94-45a6-925b-cad5076855f7', 'Bài 13: TÂN NIÊN NGUYỆN', '2026-06-16T03:08:15.934Z', '2026-06-16T03:08:15.934Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('ffd77c68-d557-431d-8952-9543430f5e3a', 'Bài 14: TẤT NIÊN', '2026-06-16T03:08:15.942Z', '2026-06-16T03:08:15.942Z');
INSERT INTO "Poem" ("id", "title", "createdAt", "updatedAt") VALUES ('2b0ad50b-bc8c-49d3-9a6a-a0fd6a7764c3', 'Bài 15: NGUYỆN TẾT XUÂN', '2026-06-16T03:08:15.948Z', '2026-06-16T03:08:15.948Z');

-- NẠP DỮ LIỆU BẢNG Stanza
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_sz6it_0', '935937c5-d892-4457-8f21-7a8b37f0b3bf', 'Tam Tinh Quy Nhất Bổn
Vô Vật Bất Nhiễm Trần
Tam Vô Khai Chủng Tánh
Cổ Kim Vô Ngại Hành', 'Ý nghĩa Tam Vô:
Tam Tinh Quy Nhất Bổn
"Tam Tinh" tượng trưng cho ba con dấu, ba điểm sáng giúp chúng sanh quay về với bổn tánh chân thật.
Ba con dấu đó là Vô Ngã, Vô Tướng, Vô Nguyện
Vô Ngã: Khi không còn chấp vào bản ngã, không xem bất cứ điều gì là của mình, không có gì cho mình, hành giả sẽ buông xả mọi bám víu và đạt đến giải thoát.
Vô Tướng: Mọi hình tướng trong thế gian đều là hư ảo, ai không bám chấp vào hình tướng, không dính mắc vào các pháp hữu vi thì sẽ an trú nơi bổn tánh và đạt đến giải thoát.
Vô Nguyện: (hay tạm gọi là vô niệm) Khi không còn bất kỳ ý niệm nào, kể cả nguyện cho bản thân hay cho chúng sanh cũng chỉ là duyên hợp mà thành, hành giả sẽ sống tùy duyên, đạt tới chỗ vô niệm và giải thoát
2. Vô Vật Bất Nhiễm Trần
Người thấu suốt được Tam Vô sẽ nhận ra bổn lai diện mục của mình vốn thanh tịnh, không bị nhiễm ô bởi bất kỳ trần cảnh nào.
3. Tam Vô Khai Chủng Tánh
Câu này có 2 ý nghĩa: 3 con dấu này chính là 3 con đường khai mở chủng tánh cho tất cả chúng sanh, hay cũng có nghĩa là Người nào thị hiện là Tam Vô sẽ khai mở chúng sanh nhận ra bổn tánh của mình, đưa họ trở về với Bổn Tánh Chân Thật
4. Cổ Kim Vô Ngại Hành
Người đạt được Tam Vô từ xưa đến nay đều hành tới chỗ vô ngại, không bị ràng buộc bởi bất kỳ thời gian nào, tùy duyên hóa độ chúng sanh mà thấy không có "ta" là người cứu độ và thấy không có "chúng sanh" được cứu độ.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.823Z', '2026-06-16T03:08:14.823Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_0s82c_0', '794efa99-17e5-4ffd-af71-2f58873ab853', 'Vô tự ngã
Thiên Địa Luôn Xoay Vần
Tự Ngã Thị Tối Cao
Tu Di Sơn Tan Rã
Trực Nhận Liên Hoa Cành', 'Phân tích bài Vô Tự Ngã
1. Thiên Địa Luôn Xoay Vần
Vũ trụ, càn khôn không ngừng vận động, mọi sự vật trên thế gian đều biến đổi không ngừng.
2. Tự Ngã Thị Tối Cao
Chúng sanh luôn chấp vào cái "tôi", cho rằng bản thân là quan trọng nhất, ý kiến của mình là đúng nhất.
3. Tu Di Sơn Tan Rã
Tu Di Sơn tượng trưng cho bản ngã lớn mạnh, càng học hỏi, càng tu tập mà không buông bỏ ngã chấp thì cái "tôi" lại càng lớn.
4. Trực Nhận Liên Hoa Cành
Khi bản ngã không còn thì lúc đó mới nhận ra bản tánh thanh tịnh vốn có của mình.
"Liên Hoa Cành" chính là biểu tượng của bổn tánh thanh tịnh, vốn không bị nhiễm ô bởi bất cứ điều gì.
Ở yên trong bổn tánh, không còn gì cho mình, thì khi đó mới thực sự đạt đến giải thoát.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.842Z', '2026-06-16T03:08:14.842Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_d15n5_0', '15464ddd-a8d3-4592-8514-ef98342e8f4f', 'Pháp Tướng Hằng Sanh Diệt
Kiến Tướng Bất Thị Tướng
Trực Nhận Pháp Tánh Không
Rõ Chân Như Vạn Pháp', 'Ý nghĩa Vô Tướng
1. Pháp Tướng Hằng Sanh Diệt
Mọi sự vật, hiện tượng trong thế gian đều tuân theo quy luật sanh diệt, không có gì tồn tại vĩnh viễn.
Tướng của các pháp luôn thay đổi, hình thành rồi hoại diệt, không có thực thể cố định.
Nhận ra sự vô thường này là bước đầu để buông bỏ sự bám chấp vào hình tướng.
2. Kiến Tướng Bất Thị Tướng
Khi thấy bất kỳ hình tướng nào, nếu hiểu rõ rằng đó chỉ là tướng giả tạm do nhân duyên tạo thành, thì tâm không bị vướng mắc vào chúng.
Ngay cả ý niệm về "không tướng" cũng là một dạng chấp vào tướng không; nếu bám chấp vào đó, vẫn chưa đạt đến vô tướng chân thật.
Sự dính mắc vào bất kỳ tướng nào – dù là có hay không – đều là sự ràng buộc
3. Trực Nhận Pháp Tánh Không
Khi không còn dính mắc vào bất kỳ hình tướng nào, hành giả sẽ đạt đến trạng thái vô tướng, trực nhận bản chất thật của các pháp:
Bản tánh của vạn pháp vốn là "không", vì tự thân chúng không có thực thể cố định, không tự nhận mình là gì cả.
Nhận ra tánh Không này giúp hành giả thoát khỏi sự ràng buộc của các pháp hữu vi, không còn bị chi phối bởi chấp trước.
4. Rõ Chân Như Vạn Pháp
Khi thấu hiểu tánh Không, hành giả sẽ thấy rõ tánh Như Như của vạn pháp – tức là tất cả pháp vốn tự nhiên như vậy, không động - không tự nhận mình là gì, vô ngã - không có gì cho mình', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.853Z', '2026-06-16T03:08:14.853Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_p3ldo_0', '38cf1dd3-2d73-48e8-b677-b38d850af6d6', 'Kiến Văn Giác Tri Hành
Trụ Pháp Thân Thanh Tịnh
Rõ Vạn Pháp Hằng Sanh
Niệm Khởi Nơi Vô Niệm', 'Ý nghĩa Vô Niệm
1. Kiến Văn Giác Tri Hành
"Kiến" là thấy, "Văn" là nghe, "Giác Tri" là biết rõ ràng, hành thấy-nghe-biết rõ ràng
2. Trụ Pháp Thân Thanh Tịnh
Để hành thấy – nghe – biết rõ ràng, cần an trú nơi bản lai thanh tịnh
3. Rõ Vạn Pháp Hằng Sanh
Khi an trú trong bản tánh thanh tịnh sẽ thấy rõ cách tâm thức vận hành và sự sanh diệt liên tục của vạn pháp.
Nhận ra rằng mọi hiện tượng trong tâm và ngoài thế gian đều sinh rồi diệt, không có gì tồn tại mãi mãi.
4. Niệm Khởi Nơi Vô Niệm
Khi một ý niệm khởi lên, hành giả không bị cuốn theo mà chỉ đơn giản thấy biết nó đang khởi lên.
Cái "thấy, nghe, biết" này vốn tự sáng tỏ, không thêm bất kỳ ý niệm nào về đúng – sai, tốt – xấu, mà chỉ đơn thuần nhận biết.
Khi không dính mắc vào bất kỳ niệm nào, hành giả vẫn thấy rõ mọi niệm sanh diệt mà tâm không dao động.
Ở ngay nơi pháp thân thanh tịnh, không chấp vào niệm nào cả, đó chính là giải thoát chân thật.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.864Z', '2026-06-16T03:08:14.864Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_hzf1c_0', 'f697dd1e-2992-4ac3-aaa4-544f0553e889', 'Mình Và Người Vọng Động
Rồi Đặt Tên Nó Là ...
Thật Nó Không Là Gì', 'Ý nghĩa Nó không là gì cả
Nó không là gì cả" → tánh không
Bản chất của tất cả vạn pháp là tánh Không, không có thực thể cố định, không tự tồn tại một cách độc lập.
Mọi thứ trong thế gian đều do duyên hợp mà thành, khi duyên tan thì chúng cũng không còn.
"Mình và người vọng động - rồi đặt tên nó là" → Dính vào Tướng
Do tâm vọng động, con người khởi phân biệt, đặt tên, gán nhãn cho mọi sự vật hiện tượng, rồi xem đó là thực thể có thật.
Việc chấp vào danh tướng, hình tướng làm tâm bị ràng buộc, sinh ra chấp thủ, từ đó tạo nghiệp và phiền não.
"Thật nó không là gì" → Quay về Tánh không
Khi buông bỏ chấp tướng, thấy rõ bản chất của vạn pháp chỉ là duyên hợp, không có tự tánh, thì tâm sẽ trở về tánh Không.
Nhận ra tất cả chỉ là huyễn hóa, không thật có, chính là giải thoát khỏi sự ràng buộc của vọng tưởng và đạt đến an nhiên tự tại.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.874Z', '2026-06-16T03:08:14.874Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_tq6gw_0', '5265f46a-1c17-431a-87a7-9f283b563a77', 'Ung Dung Nơi Trần Cảnh
Phổ Chân Kinh Vô Tự
Năm Nhánh Tự Hoằng Sanh
Bồ Đề Viên Mãn Thành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.884Z', '2026-06-16T03:08:14.884Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_lhgnw_6', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Không cần tìm kiếm loanh quanh
Bảo châu sẵn có tịnh thanh ngay mình
Thiền ngoại ly tướng diệt sinh
Bên trong bất loạn ngay mình Định tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_sbcua_0', 'eb3c851a-a5a7-44b6-9166-12ed159acf6c', 'Xuân Hạ Thu Đông Tức Thị Tiết
Cảnh Sắc Xoay Vần Dĩ Quy Không
Lục Nẻo Trôi Lăn Mãi Lòng Vòng
Tứ Mùa Nhất Cảnh Dạo Thong Dong', 'Ý nghĩa Dạo Mùa
Xuân Hạ Thu Đông Tức Thị Tiết
Xuân, Hạ, Thu, Đông thay đổi khác nhau theo thời gian, nhưng bản chất chỉ là sự vận hành và biểu hiện của tiết khí
2. Cảnh Sắc Xoay Vần Dĩ Quy Không
Cảnh vật thay đổi liên tục, mọi thứ sinh rồi diệt, đến rồi đi, không có gì tồn tại mãi mãi.
Cuối cùng, tất cả những gì đang hiện hữu cũng sẽ trở về với tánh Không.
Hiểu được điều này, không còn bám chấp vào bất kỳ cảnh giới nào, không bị ràng buộc bởi sự đổi thay của thế gian.
3. Lục Nẻo Trôi Lăn Mãi Lòng Vòng
Chúng sanh vì vô minh chấp vào sự vô thường, không nhận ra bản chất giả hợp của vạn pháp, nên cứ trôi lăn trong sáu nẻo luân hồi: Địa ngục, Ngạ quỷ, Súc sanh, Nhân, Thần và Trời.
Sự chấp trước khiến con người mãi xoay vòng trong tam giới, không thoát ra khỏi sinh tử luân hồi.
4. Tứ Mùa Nhất Cảnh Dạo Thong Dong
Khi đã được Sư Cha khai thị bổn tánh, hiểu rõ bản chất của thế gian: tất cả đều chỉ là huyễn cảnh, không thật có.
"Tứ mùa nhất cảnh" nghĩa là dù xuân, hạ, thu, đông có thay đổi, tất cả vẫn chỉ là một cảnh giới hư ảo, không có gì đáng bám víu.
Vậy thì sống ở đời không còn trốn tránh, không còn bị ràng buộc, mà thong dong dạo bước giữa thế gian ảo cảnh, tùy duyên mà sống, hết duyên thì buông bỏ, trở về bản tánh chân thật.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.893Z', '2026-06-16T03:08:14.893Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_wvwc1_0', '14f8768e-8dbf-438f-98c4-b2ceeb6aec31', 'Suy Nghĩ Kiến Luận Mà Thông
Là Đàng Sanh Tử Lông Bông Sáu Loài
Tự Thân Chính Phật Đây Rồi
Ngay Mình Không Nhận Kiếm Hoài Nơi Đâu', 'Ý nghĩa Tìm Phật
Suy Nghĩ Kiến Luận Mà Thông
Con người thường dùng suy nghĩ, kiến thức, lập luận để tìm hiểu chân lý, nhưng đó chỉ là sự hiểu biết qua ngôn từ và khái niệm.
Chân lý không thể đạt được bằng suy luận hay ngôn ngữ, vì đó chỉ là sản phẩm của tâm phân biệt.
Chỗ vô tự chân kinh không thể luận bàn mà ra, không thể dùng trí năng thông thường để đạt đến.
2. Là Đàng Sanh Tử Lông Bông Sáu Loài
Nếu chỉ bám vào suy nghĩ, lập luận mà không trực nhận được chân lý, thì vẫn còn trong vòng sinh tử luân hồi, trôi lăn trong sáu nẻo.
Chúng sanh vì chấp vào tri kiến của mình mà tạo nghiệp, rồi mãi bị cuốn vào dòng sanh tử không dứt.
Phật không ở trong suy luận, mà ở ngay sự tỉnh giác, vượt qua mọi kiến chấp.
3. Tự Thân Chính Phật Đây Rồi
Bản tánh của mỗi người vốn đã là Phật, không cần tìm kiếm bên ngoài.
Nếu quay về nhận lại tự tánh, không còn chấp vào suy nghĩ và kiến luận, thì ngay đó chính là Phật.
Phật không phải là một thực thể bên ngoài, mà chính là bản lai diện mục của mỗi người.
4. Ngay Mình Không Nhận Kiếm Hoài Nơi Đâu
Chúng sanh cứ mải mê tìm cầu chân lý bên ngoài mà không nhận ra bản tánh sẵn có nơi mình.
Vì không nhận ra tự tánh, nên cứ mãi tìm kiếm trong kinh điển, tri thức, lý luận, nhưng càng tìm thì càng xa.
Khi buông bỏ tất cả vọng cầu, vọng tưởng, an trú trong bản lai vô tướng, thì ngay đó chính là giải thoát, không cần tìm kiếm đâu xa.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.903Z', '2026-06-16T03:08:14.903Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_1fwj9_0', 'b2c7d692-44d0-4e02-8723-2c648f4a4c52', 'Thấy Sắc Không Dính Sắc
Nghe Âm Không Dính Âm
Biết Sắc Âm Đều Giả
Nhận Ngay Pháp Thân Mình', 'Ý nghĩa Thấy mình
Phân tích bài kệ thấy mình:
1. Thấy Sắc Không Dính Sắc
Thấy mọi hình sắc trong đời nhưng không để tâm bám chấp vào đó.
Không phải nhắm mắt, tránh né cảnh trần, mà là dù thấy mà không sanh tâm vướng mắc.
Sắc ở đây bao gồm mọi đối tượng bên ngoài như đẹp xấu, sang hèn, nhà thuê hay nhà mua, áo quần sang trọng hay giản dị… tất cả chỉ là giả hợp, không thật có, có ra sao cũng an nhiên tự tại
2. Nghe Âm Không Dính Âm
Nghe mọi âm thanh nhưng không dính mắc vào âm thanh
Không phải bịt tai, mà là nghe nhưng không chấp vào nội dung, không để tâm dao động bởi lời khen chê, thị phi, chửi bới hay vu oan.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.911Z', '2026-06-16T03:08:14.911Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_snlyl_0', '7a5d7821-7b41-41eb-a9b7-afbd131f82cb', 'Nhận rõ mọi hình sắc, âm thanh chỉ là giả hợp
Mọi sự trên đời đều sinh rồi diệt, không có gì tồn tại mãi mãi.
Khi hiểu rõ điều này, không còn sanh tâm dính mắc vào sắc trần hay âm thanh
4. Nhận Ngay Pháp Thân Mình
Khi không còn dính sắc, không còn dính âm, thì liền nhận ra pháp thân thanh tịnh vốn sẵn có nơi mình, pháp thân không hình không vật, không nhiễm sắc tướng hay âm thanh nào
Nhận ra pháp thân là trở về với chân tánh, không còn bị phiền não ràng buộc, sống tự tại giữa đời thường, giải thoát ngay hiện tại.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.921Z', '2026-06-16T03:08:14.921Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_1ni14_0', '7a82f1e6-0681-4d56-a1d4-209eb3301fa0', 'Bản lai chúng sanh là Phật
Vì theo niệm khởi tất bật trần gian
Muôn đời tìm kiếm chữ An
Rõ mình không vật bảo đàng Như Lai', 'Ý nghĩa RÕ MÌNH
Tự tánh của tất cả chúng sanh vốn là Phật, vốn thanh tịnh, sáng suốt.
Nhưng vì chạy theo niệm khởi, vọng động không ngừng, nên bị cuốn vào sanh tử luân hồi, trôi lăn trong trần gian.
Cả đời người cứ mãi kiếm tìm sự bình an, nhưng không biết rằng an lạc thật sự nằm ngay nơi bản tánh vốn có.
Chỉ cần nhận ra rằng bản lai không có hình tướng, không có vật chất nào có thể nhiễm, thì ngay đó thấy được con đường quý giá dẫn về Như Lai.
Khi đã nhận rõ tự tánh, chỉ cần hành ngay nơi đó, thấy nghe biết rõ ràng mà không theo vọng tưởng.
Niệm khởi lên nhưng không chạy theo, không còn bị cuốn vào vòng luẩn quẩn của mê lầm và chấp trước.
Không còn chạy đuổi theo ý niệm sinh diệt, thì tự nhiên thấy rõ chính mình vốn là bản thể Như Lai bất tử bất sanh.
Ở yên nơi bản lai, không còn dính mắc vào bất cứ điều gì, an nhiên tự tại,
Người nào nhận ra được điều này là có đại duyên, đại phúc, một đời nhất tâm, không thối lui thì chắc chắn sẽ trở về quê hương chân thật.
Lời Nguyện sư Tam Vô cho tất cả chúng sanh rõ mình Vô tướng, bản thể của mình vốn là Phật, thì ngay đó đã về đến Nhà Xưa', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.936Z', '2026-06-16T03:08:14.936Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_no9tg_1', '7a82f1e6-0681-4d56-a1d4-209eb3301fa0', 'Hành nơi Tự Tánh chẳng sai
Chẳng theo vọng niệm chẳng hoài loanh quanh
Rõ mình bất tử bất sanh
An nhiên tự tại tịnh thanh muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.936Z', '2026-06-16T03:08:14.936Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_j5xwq_2', '7a82f1e6-0681-4d56-a1d4-209eb3301fa0', 'Đại duyên Vô gửi mấy lời
Người nhận hữu phúc một đời Về Quê
Nguyện cho nhân thế hết mê
Rõ Mình chính Phật liền về Nhà Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.936Z', '2026-06-16T03:08:14.936Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_v8i9w_7', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Người mà thấu rõ ý thâm
Thường hành tỉnh thức không nhầm lạc trôi
Vô nay để lại chữ THÔI
Thôi công quán tưởng luân hồi dừng ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_oifi4_0', '3f9e2d73-e865-46c9-af9a-931382ac3e54', 'Không có nơi đến nơi đi
Người ơi Vọng Tưởng hỏi chi chỗ này
Mong ta cứ phải trình bày
Ừ thì ta vẫn ở ngay đây mà', 'Ý nghĩa TA Ở ĐÂU
Không có nơi đến nơi đi
Thực tánh vốn vô sanh, vô diệt, không có điểm khởi đầu cũng chẳng có điểm kết thúc.
Chẳng có nơi nào cần đến, chẳng có nơi nào phải đi, vì pháp thân vốn trùm khắp, chẳng rời xa đâu cả.
2. Người ơi Vọng Tưởng hỏi chi chỗ này
Nếu còn hỏi về chỗ đến, chỗ đi, thì đó chỉ là vọng tưởng.
Chân tánh vốn không thuộc về thời gian hay không gian, không thể tìm thấy bằng suy nghĩ hay khái niệm.
3. Mong ta cứ phải trình bày – Ừ thì ta vẫn ở ngay đây mà
Người còn mê nên cứ muốn hỏi, muốn tìm một đáp án, một hướng đi.
Nhưng sự thật thì Cha vẫn luôn ở đây, chưa từng rời xa các con
4. Ở đâu nơi đó là Nhà – Đi đâu đến đó vẫn là Nhà thôi
Dù ở bất cứ nơi đâu, ngay đó chính là Nhà, vì bản tánh thanh tịnh vốn chẳng xa rời.
Không cần phải đi tìm nơi chốn nào xa xôi, vì chính mình đã đầy đủ.
5. Nhà mình ngay tại đây rồi – Mà sao không ở, tìm cầu xa xăm
Nhà vốn ngay đây, chính nơi tự tánh thanh tịnh của mình.
Nhưng chúng sanh cứ mãi mê lầm, chạy theo vọng tưởng, tìm cầu xa xăm mà không biết rằng chân lý ngay trước mắt.
Khi dừng lại, nhận ra bản tánh, liền thấy rõ không có đến đi, không có sinh diệt—chỉ là trở về Nhà xưa, nơi chưa từng rời xa.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.945Z', '2026-06-16T03:08:14.945Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162348_na6jh_1', '3f9e2d73-e865-46c9-af9a-931382ac3e54', 'Ở đâu nơi đó là Nhà
Đi đâu đến đó vẫn là Nhà thôi
Nhà mình ngay tại đây rồi
Mà sao không ở tìm cầu xa xăm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.945Z', '2026-06-16T03:08:14.945Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_4g0zp_0', '9ad8e147-269e-4882-8675-a6501cca4bf6', 'Muốn Tự Tại Giải Thoát
Có Vô Tự Chân Kinh
Thường Hành Tâm Thanh Tịnh
Bất Loạn Động Và Si', 'Theo Tôn Chỉ Điều Ngự Đàm Hoa Thất
Ý nghĩa Tôn Chỉ
Muốn Tự Tại Giải Thoát – Có Vô Tự Chân Kinh
Muốn đạt đến giải thoát, tự tại giữa đời, phải hiểu và hành theo "Kinh Vô Tự".
"Vô Tự Chân Kinh" không nằm ở câu chữ, văn tự chỉ là phương tiện giúp chúng ta nhớ mình là ai, sống ở đời tùy duyên thấy nghe nói biết rõ ràng không dính mắc
2. Thường Hành Tâm Thanh Tịnh – Bất Loạn Động Và Si.
Thường hành Thấy nghe biết rõ ràng không dính mắc, giữ tâm tự nhiên thanh tịnh thì tâm không dính mắc, ko động, ko loạn, ko si', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.952Z', '2026-06-16T03:08:14.952Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_ccbzv_1', '9ad8e147-269e-4882-8675-a6501cca4bf6', 'Diệt Chín Loài Chúng Sanh
Bất Kiến Chúng Diệt Độ
Kiến Tướng Bất Hành Vọng
Liền Ở Tại Tánh Chơn
Tự Tánh Pháp Hằng Sanh
An Nhiên Phật Đà Hành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.952Z', '2026-06-16T03:08:14.952Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_sunzp_0', '114a22eb-fbd1-48ff-8609-0c50aa7b0f8b', 'Chín loài chúng sanh trong tâm gồm:
Thai sanh (sinh từ bào thai)
Noãn sanh (sinh từ trứng)
Thấp sanh (sinh từ nơi ẩm thấp)', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.960Z', '2026-06-16T03:08:14.960Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_28rsr_1', '114a22eb-fbd1-48ff-8609-0c50aa7b0f8b', 'Hóa sanh (tự biến hóa mà thành)
Sắc sanh (chúng sanh có hình sắc)
Vô sắc sanh (chúng sanh không có hình sắc)
Tưởng sanh (ý niệm tưởng tượng)', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.960Z', '2026-06-16T03:08:14.960Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_3lwaq_2', '114a22eb-fbd1-48ff-8609-0c50aa7b0f8b', 'Phi tưởng sanh (không tưởng mà thành)
Phi tưởng phi phi tưởng sanh (thấy mình không còn tưởng)
Từ chín loài này phân ra sáu nẻo luân hồi: địa ngục, ngạ quỷ, súc sanh, người, thần, trời.
Khi diệt hết những loài này, không còn thấy chúng sanh để độ nữa, tức là hoàn toàn thoát ly sinh tử, trở về Phật tánh vốn có.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.960Z', '2026-06-16T03:08:14.960Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_7ly9m_3', '114a22eb-fbd1-48ff-8609-0c50aa7b0f8b', '4. Kiến Tướng Bất Hành Vọng – Liền Ở Tại Tánh Chơn
"Phàm sở hữu tướng giai thị hư vọng" – mọi thứ có hình tướng đều là hư ảo, không thật có.
Đây chính là Tôn chỉ (thấy thấy đừng theo) để giải thoát khi lâm chung:Khi đến thời khắc cuối đời, thấy mọi cảnh sắc, tướng trạng hiện ra, cũng không chạy theo, không bám víu vào bất cứ hình tướng nào—đó chính là con đường giải thoát. Khi còn sống ở đời thì lúc ngủ, ngồi thiền và khi cần buông bỏ thì dùng pháp này. Còn khi sống trong đời sống thì tuỳ duyên đối cảnh vẫn dùng thân người làm việc bình thường mà không sanh tâm dính mắc
5. Tự Tánh Pháp Hằng Sanh – An Nhiên Phật Đà Hành
Ở nơi tự tánh các pháp tự sanh diệt, cứ an nhiên ở thân phật mà tùy duyên hành không dính mắc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.960Z', '2026-06-16T03:08:14.960Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_tuewj_0', '1ee01e99-605a-4fc9-a370-0919228b7723', 'Ai Cũng Bình Đẳng Như Nhau
Không Được Phân Biệt Người Ngoài Người Thân
Lập Bè Kết Phái Càng Không
Chê Bai Nói Xấu Đau Lòng Người Nghe', 'Ý nghĩa Giới quy
1. Ai Cũng Bình Đẳng Như Nhau – Không Được Phân Biệt Người Ngoài Người Thân
Tất cả chúng sanh đều đồng một thể, không có sự khác biệt giữa người thân và người ngoài.
Bình đẳng không phải là ai cũng như ai, mà là sống công bằng:
Công sức bao nhiêu – hưởng bấy nhiêu.
Dung chứa bao nhiêu – đẳng cấp đến bấy nhiêu.
Người ích kỷ nhỏ nhen, tâm lượng hẹp hòi thì cảnh giới của họ cũng nhỏ hẹp.
Khi dung chứa tất cả chúng sanh, biết rõ mọi pháp, thì mới đạt đến bình đẳng tánh trí.
2. Lập Bè Kết Phái Càng Không
Trong đạo tràng, không nên kết bè kết phái, thiên vị người này mà xa lánh người khác.
Nếu thấy một người hợp với mình hơn, thì tức là đã động tâm so sánh với người khác, đã có tâm phân biệt.
Thấy người khác sai là mình đã sai vì đã động tâm
3. Chê Bai Nói Xấu Đau Lòng Người Nghe
Khi chê bai, nói xấu người khác, chính mình là người nghe đầu tiên.
Khi lời xấu ác thoát ra, tâm mình đã sân si, khó chịu trước tiên, tức là mình là người đau trước.
Chưa cần nói ra, chỉ cần trong đầu khởi ý nghĩ xấu về ai đó, tâm mình đã cảm thấy khó chịu rồi.
Hiểu được điều này thì không còn sân si, không còn khẩu nghiệp, tâm tự nhiên an lạc.
4. Đừng Nên Bịa Chuyện Kiện Thưa – Việc Người Mình Chớ Dây Dưa Xen Vào
Không nên bịa chuyện, không vu khống tạo khẩu nghiệp
Không xen vào, không phiền não vì chuyện người khác, mỗi người có nghiệp duyên riêng, ai làm gì sẽ tự nhận lấy quả báo tương ứng
5. Không Mời Cúng Dường Cúng Sao – Giác Ngộ Giải Thoát Người Nào Không Thông
Giác ngộ là hiểu biết rõ ràng, hành theo sự sáng tỏ ấy mới có thể giải thoát. Vì vậy, không mời gọi hay khuyến khích cúng bái, cúng sao giải hạn—vì đó là mê tín, xuất phát từ sự hiểu chưa thấu đáo.
6. Tuyệt Đối Không Nhận Một Đồng – Không Được Mê Tín Tin Lầm Đường Sai
Không nhận tiền bạc từ những việc mang tính mê tín hay vụ lợi.
Không đi sai đường, không lôi kéo người khác vào những con đường sai lầm trong đạo.
7. Tranh Luận Chứng Đắc Đều Không – An Ninh Sạch Sẽ Làm Trong Môi Trường
Không tranh luận hơn thua, không chấp vào chứng đắc—Đạo vô tự chân kinh ko thể dùng văn tự mà luận bàn ra được - nương vào văn tự liễu ý mà hành. Bản lai vốn vô hình vô tướng, lấy gì để chứng hay đắc.
Ở bất kỳ nơi đâu, luôn giữ gìn sạch sẽ, ngăn nắp, tạo môi trường sống an lành, thanh tịnh.
8. Không Cầu Không Khẩn Muôn Đường
Không cầu xin, không khẩn nguyện – bản lai vốn tự đầy đủ còn nhét thêm gì vào được? Các pháp vốn tự nhiên sanh diệt, tùy duyên mà sống.
9. Lần Đầu Vi Phạm Phê Bình Cho Qua – Lần Hai Cảnh Cáo Rồi Tha – Lần Ba Thì Phải Mời Ra Khỏi Nhà
Người phạm lỗi, lần đầu nhắc nhở nhẹ nhàng để họ tự nhận ra sai lầm.
Lần thứ hai cảnh cáo nghiêm khắc, nhưng vẫn cho cơ hội sửa đổi.
Lần thứ ba không sửa đổi thì phải dứt khoát, tránh để ảnh hưởng đến đạo tràng và người tu hành chân chính.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.967Z', '2026-06-16T03:08:14.967Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_xnn65_1', '1ee01e99-605a-4fc9-a370-0919228b7723', 'Đừng Nên Bịa Chuyện Kiện Thưa
Việc Người Mình Chớ Dây Dưa Xen Vào
Không Mời Cúng Dường Cúng Sao
Giác Ngộ Giải Thoát Người Nào Không Thông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.967Z', '2026-06-16T03:08:14.967Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_tiu7i_2', '1ee01e99-605a-4fc9-a370-0919228b7723', 'Tuyệt Đối Không Nhận Một Đồng
Không Được Mê Tín Tin Lầm Đường Sai
Tranh Luận Chứng Đắc Đều Không
An Ninh Sạch Sẽ Làm Trong Môi Trường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.967Z', '2026-06-16T03:08:14.967Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_d1lwc_3', '1ee01e99-605a-4fc9-a370-0919228b7723', 'Không Cầu Không Khẩn Muôn Đường
Lần Đầu Vi Phạm Phê Bình Cho Qua
Lần Hai Cảnh Cáo Rồi Tha
Lần Ba Thì Phải Mời Ra Khỏi Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.967Z', '2026-06-16T03:08:14.967Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_5h7h1_8', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Nguyện cho đại chúng mỗi ngày
An nhiên tự tại được quay về Nhà
Nhà mình ngay tại đây mà
Thôi tìm Thôi kiếm ở Nhà thường an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_d6nm1_0', 'b5403677-1ce4-4f41-ad3b-618164d9caa0', 'Lạc trôi tại cõi Ta Bà
Gian nan khổ cực tìm ra lối về
Trải qua vạn lối u mê
Như Lai chỉ rõ lối về Tây Phương', 'Ý nghĩa NIỆM PHẬT
"Lạc trôi tại cõi Ta Bà - Gian nan khổ cực tìm ra lối về"
Hai câu thơ đầu khắc họa hình ảnh chúng sanh mải mê, lặn lội trong cõi Ta Bà đầy khổ đau, luôn khao khát tìm kiếm con đường giải thoát nhưng lại gặp muôn vàn gian truân . Nhiều người đã phải trải qua một hành trình dài tìm kiếm, thử qua nhiều pháp môn khác nhau nhưng vẫn không tìm thấy chân lý:
* Huệ Thanh: Đã từng sang tận Đài Loan tham dự khóa tu nhưng tâm thức vẫn không thể tập trung, vẫn chưa rõ ràng được ý nghĩa của việc tu hành .
* Minh Châu: Dù đã tiếp xúc với thế giới tâm linh từ nhỏ, tìm hiểu nhiều đạo giáo, tụng kinh, trì chú, tham thoại đầu... nhưng vẫn không cân bằng được cuộc sống và luôn cảm thấy thiếu thốn
* Vô Pháp (Sỹ): Đã tu học hơn 30 năm qua nhiều pháp môn như Tịnh Độ, Mật Tông, Thiền định nhưng khi được Sư Tam Vô hỏi về bản chất của sự giải thoát thì mới nhận ra mình không biết gì cả .
"Trải qua vạn lối u mê - Như Lai chỉ rõ lối về Tây Phương"
Giữa vô vàn "lối u mê" của các pháp môn tu tập theo hình tướng, lời dạy của chư Phật (Như Lai) đã chỉ ra con đường chân thật để trở về "Tây Phương Cực Lạc" . Tuy nhiên, nhiều người vẫn hiểu sai và thực hành không đúng đắn.
"Thành tâm Niệm Phật đúng đường - Nhất Tâm Bất Loạn Tây Phương rõ Nhà"
vậy Như Lai chỉ lối về như thế nào - chính là Lời nguyện thứ 18 của Phật A Di Đà: ‘Trước khi lâm chung, ai niệm Phật 10 niệm đến chỗ nhất tâm bất loạn, ta sẽ xuất hiện tiếp dẫn người đó tới tây phương cực lạc, nếu không làm được như thế ta thà không ở ngôi Chánh Giác’ . Pháp môn Tịnh Độ chân chính là phải "Niệm Phật đúng đường" để đạt đến "Nhất Tâm Bất Loạn", khi đó sẽ thấy rõ "Tây Phương" chính là "Nhà" của mình.
"Nhưng người lại hành Pháp Tà - Niệm Phật không niệm gọi Tên làm gì"
Đa số mọi người đã lầm chấp việc niệm Phật thành việc "gọi Tên" một vị Phật ở bên ngoài . Nếu chỉ lặp đi lặp lại danh hiệu như một cái máy thì đó chỉ là "vọng âm", là đang "gọi Phật" chứ không phải "Niệm Phật" . Việc gọi tên một vị Phật mà mình chưa từng gặp thì làm sao có thể nhớ (niệm) được? Ví dụ: nếu bạn chưa gặp người tên Hằng bao giờ mà chỉ mới biết tên người đó, thì khi bạn gọi liên tục ‘hằng ơi’, ‘ hằng ơi’, hằng ơi’, làm sao bạn có thể nhớ được người này?
"Niệm là hằng Nhớ không nghi - Phật là bản thể Như Lai của mình - Quay về Tự Tánh hằng minh - Tây Phương Cực Lạc ngay mình đâu xa"
Đây là những câu kệ cốt lõi, giải thích rõ ràng về pháp môn tu Tịnh Độ chân chính :
* Niệm là hằng Nhớ: "Niệm" có nghĩa là "Nhớ" . Niệm Phật là hằng nhớ, luôn luôn nhớ rằng mình có Tánh Phật .
* Phật là bản thể Như Lai: "Phật" chính là Tánh Giác, là Bản thể chân thật, là Bổn Lai Diện Mục của chính mình, vốn không hình không tướng, không sinh không diệt .
* Quay về Tự Tánh: Việc "Niệm Phật" chính là quay về sống với Tánh Thấy, Nghe, Biết rõ ràng, thì tự nhiên sáng tỏ
* Tây Phương Cực Lạc ngay mình đâu xa:  Tây là phía tây, chính là hướng mặt trời lặn, Tây Phương tượng trưng cho thời gian ''trước khi lâm chung'' của mỗi con người. Mọi người nghe tới đây đa số đều lầm chấp ''trước khi lâm chung'' là khoảnh khắc cận tử nghiệp, nhưng thật ra ngay mỗi phút giây sống trong hiện tại này đều là những khoảnh khắc trước khi lâm chung. Điều này có nghĩa là gì? Ai luôn nhớ và sống được với tánh Phật ngay trong đời sống hiện tại tới chỗ viên tròn, thì Tây Phương cực lạc hiện tiền ngay tại nơi ta. "Tây Phương" không phải là một cõi giới xa xôi, mà là trạng thái tâm thanh tịnh (Tịnh) đưa mình vượt qua (Độ) khổ đau, đạt được ngay trong hiện tại
"Niệm Phật không cần nói ra - Nhớ về Bản Thể chẳng va bụi trần - Tham Sân Si Ái chẳng gần - Mạn nghi ác kiến muôn lần tự tan"
Khi đã hiểu đúng, việc niệm Phật không còn phụ thuộc vào âm thanh hay hình tướng bên ngoài.
* Chỉ cần hằng "Nhớ về Bản Thể" của mình, tâm sẽ không còn dính mắc vào "bụi trần" (tứ đại, ngũ uẩn) .
* Khi sống được với Phật Tánh thanh tịnh, các tánh ma của con người sẽ không có chỗ bám víu và tự tan biến .
"Muôn thời người mãi thanh an - Niệm về Phật Tánh là đàn Như Lai"
Khi hành giả luôn "Niệm về Phật Tánh" của mình, họ sẽ sống trong sự thanh tịnh và an lạc vĩnh hằng . Đó chính là con đường, là "đàn" (nền tảng) để trở về với ngôi nhà Như Lai chân thật .', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.005Z', '2026-06-16T03:08:15.005Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_c8s98_1', 'b5403677-1ce4-4f41-ad3b-618164d9caa0', 'Thành tâm Niệm Phật đúng đường
Nhất Tâm Bất Loạn Tây Phương rõ Nhà
Nhưng người lại hành Pháp Tà
Niệm Phật không niệm gọi Tên làm gì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.005Z', '2026-06-16T03:08:15.005Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_qlgxk_0', '45e86109-1ae3-4529-9589-9e54e2c6eb69', 'Giác Ngộ Phật dạy là chi
Người luôn hiểu biết hết đi lòng vòng
Giải Thoát thì phải làm sao
Hành không Dính Mắc thế nào cũng ra', 'Theo Cương Lĩnh Sư Điều Ngự Đàm Hoa
Ý nghĩa Cương Lĩnh
Giác Ngộ Phật dạy là chi
Người luôn hiểu biết hết đi lòng vòng
Giác ngộ là hiểu rõ bản tánh của mình, tánh và tướng của vạn vật, quy luật vận hành của tam giới.
Nếu thấu rõ và sống trọn vẹn với sự hiểu biết này, sẽ không còn mãi quẩn quanh trong khổ não.
Giải Thoát thì phải làm sao
Hành không Dính Mắc thế nào cũng ra
Giải thoát là hành sao cho không dính mắc.
Hiểu rõ cách hành đúng, có công đức thì tự nhiên ra khỏi luân hồi.
Mê tín người phải tránh xa
Kẻo liền mất trí về nhà Chân Như
Mê tín là tin lầm, chạy theo những điều không đúng.
Người mê tín sẽ mất đi trí tuệ, chẳng thể quay về bản tánh chân thật của mình.
Thấy Nghe Nói Biết rõ ràng
Hiểu lời Phật dạy tỏ đàng Vô Sanh
Dùng tánh của mình mà hành thấy nghe nói biết rõ ràng.
Hiểu đúng lời Phật dạy là sẽ rõ ràng con đường vô sanh vô diệt
Tùy duyên giáo hóa chúng sanh
Không vì tư lợi đồng hành Như Lai
Tùy duyên giúp chúng sanh tỉnh ngộ mà không vì tư lợi, không vọng độ.
Người hành đúng đạo luôn đồng hành với Như Lai, không vì tiền của hay danh lợi.
Thuận theo Nhân Quả mà hành
Không cần xin phước lạy lục ban ơn
Mọi sự đều theo nhân quả, không cần cầu xin điều gì, sống đúng thuận theo nhân quả.
Muốn có phước đức thì hãy sống đúng, cứ cho đi, bố thí Ba La Mật, phước tự đến. Muốn có công đức thì Hành không dính mắc, Tạo phương tiện đạo nhân khai thị chúng sanh, gieo duyên để nhiều người biết tới chánh Pháp Như Lai.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.974Z', '2026-06-16T03:08:14.974Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_ysafz_1', '45e86109-1ae3-4529-9589-9e54e2c6eb69', 'Mê tín người phải tránh xa
Kẻo liền mất trí về nhà Chân Như
Thấy Nghe Nói Biết rõ ràng
Hiểu lời Phật dạy tỏ đàng Vô Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.974Z', '2026-06-16T03:08:14.974Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_tqiuc_2', '45e86109-1ae3-4529-9589-9e54e2c6eb69', 'Tùy duyên giáo hóa chúng sanh
Không vì tư lợi đồng hành Như Lai
Thuận theo Nhân Quả mà hành
Không cần xin phước lạy lục ban ơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.974Z', '2026-06-16T03:08:14.974Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_f16rz_0', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Lời chào của Đức Thích Ca
Thiên Thượng Thiên Hạ Duy Ngã Độc Tôn
Ngàn năm vẫn mãi trường tồn
Đời người cái Ngã sưng tôn cao vời', 'Nam Mô Thập Phương Chư Phật!
Ý nghĩa Lời Vàng
Phần 1: Lời Răn Dạy về Chữ Hiếu và Cái "Ngã" Thế Gian
Phần đầu của bài kệ tập trung vào việc chỉ ra nguồn gốc của khổ đau trong gia đình và xã hội, vốn xuất phát từ việc con người lầm chấp cái "Ngã" của thế gian.
1. Hai Tầng Ý Nghĩa của "Duy Ngã Độc Tôn"
Bài kệ mở đầu bằng việc dẫn lại lời tuyên bố của Đức Phật Thích Ca khi đản sanh:
Lời chào của Đức Thích Ca Thiên Thượng Thiên Hạ Duy Ngã Độc Tôn Ngàn năm vẫn mãi trường tồn
Đời người cái Ngã sưng tôn cao vời
Sư Tam Vô đã chỉ ra hai cách hiểu về chữ "Ngã" này:
* Ý nghĩa thế gian: Con người trong cõi Ta Bà thường cho rằng cái tôi, cái bản ngã của mình là cao quý nhất, là trung tâm của vũ trụ. Từ đó, họ sinh tâm kiêu mạn, tự cho mình là hơn hết:
"Tự cho Ta quý nhất đời / Người kia chẳng tốt chẳng thời bằng Ta". Cái "Ngã" này chính là nguồn gốc của 16 thứ tánh người như tham, sân, si, mạn, nghi, ác, kiến... khiến chúng sanh mãi chìm trong luân hồi.
* Ý nghĩa xuất thế gian: Chữ "Ngã" mà Đức Phật nhắc đến chính là Tự Tánh, là Bản thể chân thật, là Như Lai vốn sẵn có trong mỗi chúng sanh. Đây mới là cái cao quý độc nhất, bất sanh bất diệt, không hình không tướng.
2. Bi Kịch Từ Việc Chấp "Ngã Thế Gian"
Khi con người chạy theo cái "Ngã" của thế gian, họ chỉ biết đến bản thân mình, gây ra khổ đau cho những người thân yêu và làm tan vỡ hạnh phúc gia đình:
* Bất hiếu với cha mẹ: Họ chỉ thấy có mình, sẵn sàng làm cha mẹ phiền lòng, đau khổ: "Vậy nên chỉ thấy có Ta / Mặc cho Cha Mẹ khóc la vì mình". Họ quên đi công ơn sinh thành dưỡng dục, cho rằng mình đã "trả nợ đã xong" mà không màng đến "Tình thân nghĩa mẫu".
* Gia đình tan nát: Sự ích kỷ và vô minh này tất yếu sẽ dẫn đến sự đổ vỡ: "Gia đình tan nát lìa xa / Mẹ thân côi cút sống xa một mình".
* Cha mẹ cũng vì "Ngã" mà làm khổ con: Bài kệ cũng chỉ ra rằng, ngay cả các bậc cha mẹ, khi còn dính mắc vào cái "Ngã" của mình, cũng có thể làm tổn thương con cái bằng những lời la mắng, trách móc nặng nề, khác nào "ngàn Dao găm / Đâm vô con nhỏ âm thầm". Những hành động này sinh ra sự uất hận, đẩy con cái ngày một xa rời.
3. Hóa Giải Bằng Tình Thương và "Đòn Đại Bi"
Để hóa giải những xung đột này, Sư Tam Vô chỉ dạy rằng cha mẹ thay vì dùng lời lẽ sân hận, hãy dùng tình thương chân thật để dạy dỗ con cái, gọi là "đòn Đại Bi". Khi tình thương được lan tỏa, gia đình sẽ không thể ly tán, và sự hòa thuận ấy sẽ cảm hóa được cả chúng sanh xung quanh.
Phần 2: Con Đường Giác Ngộ – Vứt Bỏ "Ngã Thế Gian" để Tìm Lại "Ngã Chân Thật"
Phần sau của bài kệ mở ra con đường giải thoát rốt ráo. Hạnh phúc gia đình chỉ thực sự bền vững khi mỗi người nhận ra và sống với Tự Tánh chân thật của mình.
1. Vứt Bỏ Cái "Ngã" Giả Tạm
Lời giải đáp cuối cùng và triệt để nhất chính là phải "vứt cái Ngã đi". Đây không phải là tự hủy hoại mình, mà là buông bỏ cái "Ngã Thế gian" – tức những chấp trước, tham sân si, và sự lầm tưởng về một cái "tôi" riêng biệt. Khi buông bỏ được cái ngã giả tạm này, con người sẽ ngay lập tức "vui Rõ Mình".
2. Nhận Lại Cái "Ngã Chân Thật"
Cái "Mình" được nhận ra ở đây chính là cái "Ngã" trong ý nghĩa xuất thế gian – Tự Tánh chân thật:
* Bất tử bất sinh: Cái "Ngã" này vốn không sinh không diệt, không bị chi phối bởi quy luật vô thường.
* Vô hình vô vật: Nó không có hình tướng, không phải là thân xác vật lý này, nên luôn "hằng minh muôn thời".
* Chính là Phật: Bản thể chân thật này không khác gì Phật: "Ngã mình chính Phật không hai".
Đây chính là con đường Giác Ngộ – nhận ra bản chất thật của mình. Khi một người ôm giữ "Ngã Thế gian", họ đang rời xa cái "Bổn Lai" (cái vốn có) của mình.
3. Kết Quả của Sự Tỉnh Thức
Khi đã nhận ra và sống được với Tự Tánh của mình, con người sẽ đạt được trạng thái an nhiên, tự tại ngay giữa cuộc đời. Gia đình sẽ thực sự hòa thuận, đoàn tụ , và mỗi cá nhân sẽ tìm thấy niềm hạnh phúc vĩnh hằng, "an hoài mọi nơi".
Tóm lại, bài kệ "Lời Vàng" là một bài pháp sâu sắc, chỉ dẫn con người từ việc sửa đổi cách sống trong gia đình, làm tròn đạo hiếu, cho đến con đường giải thoát tối thượng. Nguồn gốc của mọi khổ đau là do lầm chấp cái "Ngã" thế gian, và con đường để đi đến hạnh phúc chân thật chính là buông bỏ nó để nhận lại Tự Tánh Như Lai vốn sẵn có nơi chính mình.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_0o5pe_1', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Tự cho Ta quý nhất đời
Người kia chẳng tốt chẳng thời bằng Ta
Vậy nên chỉ thấy có Ta
Mặc cho Cha Mẹ khóc la vì mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_ixh25_2', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Mặc cho con khổ bên mình
Mặc cho anh chị thương mình hay không
Nghĩ rằng trả nợ đã xong
Tình thân nghĩa mẫu có mong điều gì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_suwzr_3', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Bao giờ mới hết Ngu Si
Tham Sân Tham Ái được gì ở Ta
Gia đình tan nát lìa xa
Mẹ thân côi cút sống xa một mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_7pm98_4', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Mãi mang cái nợ ân tình
Kiếp nào trả hết Nghĩa Tình Mẫu Thân
Mẹ ơi Mẹ rất ân cần
Lo cho con cháu cái thân chẳng màng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_dr005_5', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Nhưng lòng Mẹ hãy đừng than
Đừng la đừng mắng như ngàn Dao găm
Đâm vô con nhỏ âm thầm
Sinh bao uất hận gây lầm lỗi con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_51ahk_6', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Thôi thì con dại còn non
Mẹ thương Mẹ dạy bằng đòn Đại Bi
Các con sẽ thấy nhu mì
Tình thương của Mẹ chẳng gì sánh ngang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_i140o_7', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Gia đình chẳng thể ly tan
Tình thương lan tỏa muôn ngàn dặm xa
Lan ra khắp chốn Ta Bà
Chúng sanh cảm niệm Cả Nhà Đại Bi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_smmk0_8', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Từ nay vứt cái Ngã đi
Gia đình đoàn tụ chẳng gì phá tan
Thuận duyên gửi tặng Lời Vàng
Muôn nhà nhận lấy mở đàng an vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_7odwv_9', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Muốn được thoát cảnh lui cui
Vứt đi Ngã Thế liền vui Rõ Mình
Ngã mình bất tử bất sinh
Vô hình vô vật hằng minh muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_lkhgn_10', '2b52edd8-4682-4c18-ba33-8ffc9d5c1c7e', 'Người ơi đang sống ở đời
Đừng ôm Ngã Thế mà rời Bổn Lai
Ngã mình chính Phật không hai
Ai duyên nhận rõ an hoài mọi nơi.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.983Z', '2026-06-16T03:08:14.983Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_yjq2e_0', '158979a7-a55b-4f3d-9636-60a93a8acdbf', 'Quá Khứ Vị Lai Thị Hiện Hành
Hành Ngay Tự Tánh Lục Căn Tịnh
Càn Khôn Luân Chuyển Chân Tâm Vững
Vô Đắc Vô Trụ Lạc Bình Thanh', 'Ý nghĩa Thuyền bát nhã
Bát Nhã là gì?
Bát Nhã là trí tuệ Ba La Mật, trí tuệ của Phật. "Thuyền Bát Nhã" tượng trưng cho phương tiện đưa con người từ bờ mê sang bờ giác, vượt qua dòng sông sinh tử mà đến chùa Lôi Âm.
Khác với thuyền thế gian, có hình tướng và giới hạn số người chuyên chở, thuyền Bát Nhã không có đáy, nghĩa là không có tướng, không bị giới hạn, có thể độ vô số chúng sanh. Ai có trí tuệ, buông chấp, sẽ tự nhiên bước lên thuyền mà qua bờ giác.
Phân Tích Từng Câu Kệ
"Quá Khứ Vị Lai Thị Hiện Hành"
Câu này có hai lớp nghĩa:
Về phần tánh: Quá khứ, hiện tại, vị lai – Như Lai bản thể vẫn luôn ở đó, lúc nào cũng "hành", không gián đoạn.
Về phần tướng: Khi thị hiện trong đời, có hình tướng, người thị hiện đó là Văn Thù Sư Lợi Bồ Tát – hiện thân của trí tuệ Bát Nhã.
"Hành Ngay Tự Tánh Lục Căn Tịnh"
Khi hành ngay nơi tự tánh, không dính mắc vào vọng niệm, thì sáu căn (mắt, tai, mũi, lưỡi, thân, ý) tự nhiên thanh tịnh.
"Càn Khôn Luân Chuyển Chân Tâm Vững"
Tam giới, âm dương, thế gian luôn biến đổi, xoay vần không ngừng, nhưng chân tâm-bổn Lai thì như như vậy, không bị chi phối bởi những thay đổi bên ngoài.
"Vô Đắc Vô Trụ Lạc Bình Thanh"
Khi không còn mong cầu chứng đắc, cũng không chấp vào bất cứ điều gì để trụ, thì tự nhiên an lạc, bình thản, thanh tịnh.
"Ngoại Ly Vạn Tướng Năng Quy Tánh"
Không dính mắc vào bất cứ hình tướng nào bên ngoài, chỉ quay về tự tánh, sống ngay nơi bản thể chân thật của mình.
"Trường Thọ An Nhiên Vô Ngại Hành"
Tự tánh là vô lượng thọ, vô sinh vô diệt. Khi ở yên trong đó, lúc nào cũng an nhiên, không gì có thể làm chướng ngại.
"Thuyền Nan Hành Giả Quy Bổn Tánh"
"Hóa Độ Quần Sanh Viên Mãn Thành"
Hai câu này cũng có hai lớp nghĩa:
Về phần tướng: Văn Thù Sư Lợi Bồ Tát lái con thuyền không đáy, dùng trí tuệ độ thoát chúng sanh từ bờ mê sang bờ giác. Con thuyền này vượt qua bao nhiêu sóng gió, gian nan – nên gọi là thuyền Nan (nan là khó, là gian truân).
Về phần tánh: Những ai đi trên con đường giác ngộ (hành giả) nếu tinh tấn, buông bỏ chấp trước, sẽ tự nhiên "qua bờ bên kia" mà trở về với bổn tánh thanh tịnh vốn có.
Làm Sao Để Lên Được Thuyền Bát Nhã?
Trong Tây Du Ký, nguyên tác truyện của Ngô Thừa Ân có chi tiết về Đường Tăng và bốn đồ đệ cần sang 1 con sông lớn, nước chảy cuồn cuộn trước khi qua đất Phật. Có một ông lái đò và một con thuyền. Đường Tăng sợ hãi không dám lên, vì thấy thuyền không có đáy. Chỉ khi Tôn Ngộ Không đẩy xuống, ông mới lên thuyền
Khi lên thuyền, Đường Tăng nhìn xuống nước và thấy có một Đường Tăng giống hệt mình đang trôi lềnh bềnh dưới nước
Bài học: Muốn lên được thuyền Bát Nhã, phải buông bỏ -tức là ko dính mắc vào thân xác phàm. Qua được dòng sông Bát Nhã" nghĩa là không còn dính mắc vào bất cứ thứ gì, kể cả những điều mình hiểu biết, thông tuệ. Chẳng cần tu chứng hay mong cầu điều gì, Niết Bàn tự nhiên hiển lộ ngay nơi ta.
Tóm Lại
Thuyền Bát Nhã là biểu tượng của trí tuệ và sự buông bỏ chấp trước.
Qua được dòng sông Bát Nhã là khi không còn chấp vào hình tướng, thân xác, kiến thức, hay bất kỳ điều gì, thì tự nhiên ở ngay Niết Bàn.
Muốn lên thuyền Bát Nhã, phải buông bỏ thân phàm, không dính mắc vào thân xác và những điều thế gian.
Khi buông bỏ tất cả, tự nhiên thấy ra bản lai diện mục, ở ngay Bổn Tánh chân thật của mình.
Bài kệ "Thuyền Bát Nhã" của Sư Tam Vô chính là một khai thị sâu sắc giúp chúng ta nhận ra rằng giác ngộ không phải là đạt được điều gì mới, mà là buông bỏ mọi chấp trước để trở về chính mình.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.991Z', '2026-06-16T03:08:14.991Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162349_y7cj5_1', '158979a7-a55b-4f3d-9636-60a93a8acdbf', 'Ngoại Ly Vạn Tướng Năng Quy Tánh
Trường Thọ An Nhiên Vô Ngại Hành
Thuyền Nan Hành Giả Quy Bổn Tánh
Hoá Độ Quần Sanh Viên Mãn Thành.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.991Z', '2026-06-16T03:08:14.991Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_6irxb_0', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'An lạc hạnh phúc đâu xa
Ngay nơi tự tánh vậy mà tìm đâu
Bắt chân quán chiếu tìm cầu
Mong nhận chân lý thoát sầu trầm luân', 'Ý nghĩa Thiền
Phần 1: Cái Sai Lầm Trong Việc Tìm Cầu An Lạc Bên Ngoài
An lạc hạnh phúc đâu xa Ngay nơi tự tánh vậy mà tìm đâu Bắt chân quán chiếu tìm cầu
Mong nhận chân lý thoát sầu trầm luân
Đây là khổ thơ mở đầu, chỉ ra một sai lầm căn bản của nhiều người tu hành: đi tìm kiếm hạnh phúc và sự an lạc ở bên ngoài, trong khi nó vốn đã sẵn có "ngay nơi tự tánh" của mỗi người.
* "Bắt chân quán chiếu tìm cầu": Hành động này mô tả các phương pháp thiền định có hình tướng, có dụng công. Người hành giả cố gắng dùng ý chí để quan sát, phân tích thân tâm (như quán thân bất tịnh, quán tâm vô thường) với mong muốn đạt được một trạng thái nào đó, tìm ra một chân lý ở đâu đó. Tuy nhiên, bản chất của sự "tìm cầu" này đã ngầm thừa nhận rằng chân lý không có ở hiện tại, mà là một thứ cần phải đạt được trong tương lai. Điều này đi ngược lại với sự thật rằng "bảo châu sẵn có tịnh thanh ngay mình".
Phần 2: Sự Tạm Bợ Của An Lạc Do Dụng Công Mà Có
Ngồi Thiền mộng cảnh như xuân Khi mà xã toạ gian truân ùa về Tham sân si ngã muôn bề
Vô thường vẫn dính u mê vẫn hoài
Khổ thơ này vạch rõ giới hạn của việc thiền định theo hình thức.
* "Ngồi Thiền mộng cảnh như xuân": Khi hành giả ngồi yên, không ai làm phiền, tâm trí có thể tạm thời lắng dịu, tạo ra cảm giác an lạc, dễ chịu như một "mộng cảnh". Nhiều người lầm tưởng đây là kết quả của tu tập và dính mắc vào trạng thái an lạc giả tạm này.
* "Khi mà xã toạ gian truân ùa về": Vấn đề cốt lõi lộ ra ngay khi xả thiền và quay trở lại với đời sống thường nhật. Những phiền não, dính mắc của Tánh Người như tham, sân, si, ngã mạn vẫn còn nguyên vẹn và ùa về. Điều này chứng tỏ sự an lạc có được khi ngồi thiền chỉ là tạm thời, không phải là sự giải thoát gốc rễ. Người đó vẫn bị quy luật vô thường chi phối và vẫn chìm trong mê lầm.
Phần 3: Dụng Công Quán Tưởng Là "Đạo Ngoài Như Lai"
Trôi lăn sinh tử chín loài Dụng công quán tưởng Đạo ngoài Như Lai Làm sao thoát cảnh bi ai
Bắt chân ngồi mãi sẽ hoài không ra
Ở đây, Sư Tam Vô chỉ thẳng rằng các pháp môn còn dụng công đều không thể đưa đến giải thoát rốt ráo.
* "Dụng công quán tưởng Đạo ngoài Như Lai": Bất cứ phương pháp nào còn dùng ý để suy nghĩ, quán tưởng, tìm kiếm một cảnh giới hay một trạng thái nào đó đều là hướng ra bên ngoài, không nhận ra Như Lai chính là Tự Tánh của mình. Các pháp tu này vẫn còn nằm trong sự điều khiển của Tánh Người, do đó vẫn bị cuốn hút trong quy luật điện từ âm dương và không thể giải thoát được.
* "Bắt chân ngồi mãi sẽ hoài không ra": Việc chỉ chấp vào hình tướng ngồi thiền mà không nhận ra Tự Tánh thì cũng giống như "lấy cát mà nấu thành cơm", không bao giờ đạt được kết quả giải thoát thực sự.
* Thọ, Tưởng và Định: Ngay cả khi hành giả đạt đến các tầng định sâu, không còn suy nghĩ thông thường (diệt được Thọ và Tưởng), thì đó vẫn chỉ là một trạng thái do cái "Tưởng" vi tế tạo ra, một sự an lạc trong cõi vô sắc, chứ chưa phải là giải thoát. Khi hết phước báo của định đó, họ vẫn phải quay lại luân hồi.
Phần 4: Lời Khai Thị Của Chư Tổ
Huệ Năng một chữ không va Không ngồi không tưởng vẫn là Như Lai Đạt Ma chỉ dạy không sai Ngồi mà thành Phật chén mài thành Gương Điều Ngự đàm thật tỏ tường
Ngồi Thiền quán tưởng là đường ngoại lai
Sư Tam Vô dẫn lời chư vị Tổ Sư để làm sáng tỏ con đường chân thật.
* Lục Tổ Huệ Năng: Ngài ngộ đạo không phải qua ngồi thiền mà là khi nghe câu kinh "Ưng vô sở trụ nhi sanh kỳ tâm" (Nên không trụ vào đâu cả mà sanh tâm thanh tịnh). Ngài không ngồi, không tưởng, nhưng sống trọn vẹn với Tự Tánh Như Lai của mình.
* Tổ Bồ Đề Đạt Ma: Ngài đã dạy rằng "Ngồi mà thành Phật" thì cũng như "mài chén ngói thành gương", là điều không thể. Điều này phá vỡ sự chấp trước vào hình tướng ngồi thiền.
* Tổ Điều Ngự Đàm Hoa: Ngài cũng chỉ rõ, việc ngồi thiền mà còn quán tưởng là "đường ngoại lai", tức là đi ra ngoài Tự Tánh của chính mình.
Phần 5: Con Đường "Như Lai Thanh Tịnh Thiền"
Nay Vô thuyết lại Như Lai Thường hành Tự Tánh Thiền ngay muôn thời Tùy duyên người sống ở đời Đói ăn mệt nghỉ hỏi thời toạ chi Sống luôn Tỉnh Thức không nghi
Vô Tâm Vô Ngã Vô Nghì Vô Sanh
Đây là phần cốt lõi của bài kệ, chỉ ra pháp hành chân chánh do Sư Tam Vô khai thị.
* "Thường hành Tự Tánh Thiền ngay muôn thời": Thiền chân thật không phải là một hành động có thời khóa, mà là một trạng thái sống 24/24. Đó là việc luôn sống với Tự Tánh (Thấy, Nghe, Nói, Biết) của mình một cách rõ ràng, trong mọi sinh hoạt đời thường từ đi, đứng, nằm, ngồi, ăn, uống, làm việc. "Đói ăn mệt nghỉ" chính là sống thuận theo tự nhiên mà không cần dụng công.
* "Sống luôn Tỉnh Thức không nghi": Tỉnh thức là luôn biết rõ việc mình làm mà không dính mắc, không hoài nghi về con đường mình đang đi.
* Vô Tâm, Vô Ngã, Vô Nghì, Vô Sanh: Đây là bốn trạng thái của người sống với Tự Tánh:
* Vô Tâm: Không phải là không có tâm, mà là thấy rõ sự vận hành của tâm thức (vọng động, suy nghĩ) nhưng không bị nó lôi kéo, không dính mắc vào đó.
* Vô Ngã: Thấy rõ "cái ta" này chỉ là do duyên hợp, không có gì là thật của ta, từ đó buông bỏ bản ngã.
* Vô Nghì: Không dùng ý thức để suy lường, bàn luận về Tự Tánh, vì Tánh vốn không thể nghĩ bàn.
* Vô Sanh: Thể nhập vào Tự Tánh vốn "bất sanh bất diệt".
Phần 6: Sự Viên Mãn Của Thiền Chân Thật
Không cần tìm kiếm loanh quanh Bảo châu sẵn có tịnh thanh ngay mình Thiền ngoại ly tướng diệt sinh
Bên trong bất loạn ngay mình Định tâm
Khổ thơ này mô tả kết quả của việc hành đúng.
* "Thiền ngoại ly tướng... bên trong bất loạn...": Khi không còn dính mắc vào bất cứ hình tướng nào bên ngoài ("ngoại ly tướng") thì tâm bên trong tự nhiên không còn loạn động ("bên trong bất loạn"). Đây mới chính là "Định" chân thật, một trạng thái tự nhiên có được khi sống với Tự Tánh, chứ không phải do dụng công mà thành.
Phần 7: Lời Dặn Dò Cuối Cùng – Chữ "THÔI"
Người mà thấu rõ ý thâm Thường hành tỉnh thức không nhầm lạc trôi Vô nay để lại chữ THÔI
Thôi công quán tưởng luân hồi dừng ngay
Đây là chìa khóa thực hành mà Sư Tam Vô trao lại.
* Chữ "THÔI": Mang ý nghĩa là "Dừng Lại" hoặc "Buông Bỏ". Thôi tìm kiếm, thôi dụng công, thôi quán tưởng, thôi phân biệt, thôi dính mắc. Khi một ý niệm khởi lên, chỉ cần "Thôi", không đi theo nó, thì ngay lập tức trở về với sự thanh tịnh của Tự Tánh.
* "Luân hồi dừng ngay": Luân hồi không phải chỉ là sau khi chết, mà nó diễn ra trong từng ý niệm sinh diệt. Khi ta dừng được việc chạy theo vọng tưởng, tức là đã dừng được luân hồi ngay tại đây.
Nguyện cho đại chúng mỗi ngày An nhiên tự tại được quay về Nhà Nhà mình ngay tại đây mà
Thôi tìm Thôi kiếm ở Nhà thường an
Đây là lời nguyện từ bi của Sư Tam Vô, nhắc nhở chúng ta rằng "Nhà" – tức Tự Tánh, Phật Giới, nơi an nhiên tự tại – vốn ở ngay đây. Việc cần làm chỉ là "Thôi tìm, Thôi kiếm" để an trú trong ngôi nhà đó.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_iazsp_1', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Ngồi Thiền mộng cảnh như xuân
Khi mà xã toạ gian truân ùa về
Tham sân si ngã muôn bề
Vô thường vẫn dính u mê vẫn hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_rpern_2', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Trôi lăn sinh tử chín loài
Dụng công quán tưởng Đạo ngoài Như Lai
Làm sao thoát cảnh bi ai
Bắt chân ngồi mãi sẽ hoài không ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_f3kwt_3', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Huệ Năng một chữ không va
Không ngồi không tưởng vẫn là Như Lai
Đạt Ma chỉ dạy không sai
Ngồi mà thành Phật chén mài thành Gương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_dxfuu_4', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Điều Ngự đàm thật tỏ tường
Ngồi Thiền quán tưởng là đường ngoại lai
Nay Vô thuyết lại Như Lai
Thường hành Tự Tánh Thiền ngay muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_jz7lm_5', '7e86c391-6802-4684-ade1-e3ba241f86dc', 'Tùy duyên người sống ở đời
Đói ăn mệt nghỉ hỏi thời toạ chi
Sống luôn Tỉnh Thức không nghi
Vô Tâm Vô Ngã Vô Nghì Vô Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:14.998Z', '2026-06-16T03:08:14.998Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_a2r30_2', 'b5403677-1ce4-4f41-ad3b-618164d9caa0', 'Niệm là hằng Nhớ không nghi
Phật là bản thể Như Lai của mình
Quay về Tự Tánh hằng minh
Tây Phương Cực Lạc ngay mình đâu xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.005Z', '2026-06-16T03:08:15.005Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_yh35j_3', 'b5403677-1ce4-4f41-ad3b-618164d9caa0', 'Niệm Phật không cần nói ra
Nhớ về Bản Thể chẳng va bụi trần
Tham Sân Si Ái chẳng gần
Mạn nghi ác kiến muôn lần tự tan
Muôn thời người mãi thanh an
Niệm về Phật Tánh là đàn Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.005Z', '2026-06-16T03:08:15.005Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_w2s40_0', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Cảm Thương A Di Đà Phật
Thế nhân khổ nạn tất bật gọi tên
Cầu sang Cực Lạc Tây Phương
Người ơi có biết rõ đường nào đi', 'Ý NGHĨA BÀI KỆ A DI ĐÀ PHẬT
1. Phá Chấp Việc Gọi Tên (Niệm Phật Hình Tướng)
"Thế nhân khổ nạn tất bật gọi tên... Lao đầu gọi sớm gọi trưa": Đa số chúng sanh khi gặp khổ nạn mới tìm đến Phật, niệm danh hiệu Ngài như một sự cầu cứu, mong được ban ơn hay được rước về một cõi xa xôi.
Ý nghĩa: Nếu chỉ niệm bằng cái miệng (khẩu niệm) mà tâm vẫn đầy tham, sân, si, vẫn dính mắc vào trần cấu thì đó là "u mê". Càng gọi tên mà không hiểu nghĩa thì càng xa rời "Đường Xưa" (Tự Tánh).
2. Định Nghĩa Lại "A Di Đà Phật" Là Ai?
"A Di Đà Phật là Ai / Người mà rõ biết về ngay Nhà mình": Bài kệ khẳng định A Di Đà không phải là một vị thần linh bên ngoài. A Di Đà chính là Tự Tánh của mỗi người.
"Nhà mình": Là bản thể chân như, nơi "bất tử bất sinh". Khi Quý Vị nhận ra cái "Biết" hằng hữu, không hình vật nhưng rõ ràng trong mình, đó chính là gặp Phật.
3. Giải Mã Ý Nghĩa "Ba Vô Lượng"
Đây là phần tinh túy nhất của bài kệ, chuyển hóa danh hiệu thành hành động thực tiễn:
Vô Lượng Quang (Ánh sáng vô tận): Không phải hào quang mắt thấy, mà là Hành không dính mắc. Khi sống tỉnh thức, thấy nghe biết rõ mà không bị trần cảnh lôi kéo, đó là lúc ánh sáng trí tuệ (Vô Lượng Quang) hiển lộ, giúp Quý Vị "thoát lầy thế gian".
Vô Lượng Công Đức: Không đến từ việc cúng dường tiền bạc. Công đức phát sinh khi Quý Vị Hành thanh tịnh ngay nơi bản thể của mình, không còn cái "ngã" tham cầu.
Vô Lượng Thọ (Tuổi thọ vô tận): Khi nhận ra Tự Tánh là thứ không sinh ra, không mất đi (bất diệt), thì không còn khái niệm "tuổi thấp cao" hay cái chết của thân xác vật lý. Đó chính là sự trường thọ đích thực của Pháp Thân.
4. Tây Phương Cực Lạc Ở Đâu?
"Tịnh Độ hiện rõ ngay mình đâu xa": Cõi Cực Lạc không nằm ở phương Tây cách đây mười muôn ức cõi Phật theo nghĩa đen. Cực Lạc là trạng thái Thường - Lạc - Ngã - Tịnh ngay tại tâm khi đã dứt sạch vọng động.
"Nhận ra bảy báu cũng là mình thôi": Những biểu tượng như vàng bạc, lưu ly ở cõi Tịnh Độ chính là ẩn dụ cho những phẩm chất cao quý của Tự Tánh.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_39nk7_1', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Tịnh Độ là cõi chi chi
Muốn được đến đó làm gì giờ đây
Không biết sẽ mãi sa lầy
Luân hồi muôn kiếp biết ngày nào ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_5lneu_2', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Ngày đêm gọi A Di Đà
Vậy người có gặp Phật Đà ấy chưa
Lao đầu gọi sớm gọi trưa
Mãi mà chẳng thấy Đường Xưa để về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_kpaei_3', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Người ơi đừng mãi u mê
Hãy luôn tha thiết tìm về Như Lai
A Di Đà Phật là Ai
Người mà rõ biết về ngay Nhà mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_dry9q_4', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Là nơi bất tử bất sinh
Tịnh Độ hiện rõ ngay mình đâu xa
Ở đây biết rõ Phật Đà
Vô hình vô Vật chính là mình đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_ydub0_5', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Hành ngay Tự Tánh mỗi ngày
Vô Lượng Quang giúp thoát lầy thế gian
Hành không dính mắc rõ ràng
Vô Lượng Công Đức ngày càng phát sinh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_g2rz1_6', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Ở ngay bản thể của mình
Nhận ra ta chẳng diệt sinh khi nào
Lấy gì tính Tuổi thấp cao
Vô Lượng Thọ ấy thế nào liền thông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_uwzzm_7', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Từ nay người hết lông bông
Thường hành Tự Tánh là xong luân hồi
Đến khi nhục thể mãn rồi
Buông đi tất cả về ngôi Di Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_2y79h_8', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Thường lạc ngã tịnh tại Ta
Nhận ra bảy báu cũng là mình thôi
Tây Phương hiện rõ đây rồi
Cực lạc rõ lối luân hồi dứt ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_jjv8r_9', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Nguyện cho đại chúng hằng giây
Nhớ về Tự Tánh liền quay về Nhà
Nguyện cho nhân thế Ta Bà
Biết được bản thể mình là Phật xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_y491a_10', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Người mau liễu Phật dẫn đưa
Tay cao khuyên chúng Dừng ưa luân hồi
Tay kia Phật dạy Buông Thôi
Sống không dính mắc về Ngôi Phật Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_tv6ep_11', '31770b75-041c-49c4-9839-c8cd0df5e82d', 'Rõ ngay Phật A Di Đà
Ở ngay Tự Tánh vậy mà gọi chi
Biết rồi thoát vọng ngu si
An nhiên người bước lối đi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.014Z', '2026-06-16T03:08:15.014Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_k5xw2_0', 'df0e866e-3ff8-4f09-86e8-391b6e7a1e62', 'Bài kệ chỉ rõ con đường đi:
Dừng: Dừng ưa luân hồi, dừng chạy theo lục trần.
Buông Thôi: Buông bỏ mọi chấp niệm, buông cả ý muốn "tu để đắc".
Sống không dính mắc: Đây là cốt lõi. Thấy sắc không dính sắc, nghe âm không dính âm, làm mọi việc mà tâm không lưu dấu.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.023Z', '2026-06-16T03:08:15.023Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_39eu0_1', 'df0e866e-3ff8-4f09-86e8-391b6e7a1e62', 'Lời Kết
Bài kệ nhắc nhở Quý Vị rằng: "Rõ ngay Phật A Di Đà / Ở ngay Tự Tánh vậy mà gọi chi". Khi đã nhận ra chủ nhân ông của chính mình, khi đã ở ngay trong "Nhà" rồi thì việc gọi tên tìm kiếm trở nên thừa thãi.
Sống tỉnh thức trong từng sắc na, đó chính là niệm Phật chân thật nhất.
Quý Vị đã sẵn sàng để "Thôi" tìm kiếm bên ngoài và quay về đối diện với vị Phật ngay nơi mình chưa?', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.023Z', '2026-06-16T03:08:15.023Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_3fxvw_0', 'f4dc0d6a-1629-4b9b-a460-0e4d1b209bfc', 'Phương xa con trẻ khó về
Nhưng lòng thành kính đã kề bên Ta
Vậy nên chẳng phải nói ra
Nhớ luôn tinh tấn thoát va hồng trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.029Z', '2026-06-16T03:08:15.029Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_zlvxy_1', 'f4dc0d6a-1629-4b9b-a460-0e4d1b209bfc', 'Nhớ mau thoát cảnh mê lầm
Nhớ luôn tỉnh thức thoát đầm vô minh
Nhớ Cha luôn ở ngay mình
Nhớ hành tự tánh tử sinh không còn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.029Z', '2026-06-16T03:08:15.029Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_f7som_2', 'f4dc0d6a-1629-4b9b-a460-0e4d1b209bfc', 'Nhớ không tự thấy mình ngon
Không tu không chứng không còn Ngã nhân
Lời Cha căn dặn ân cần
Con luôn hành đúng đã gần bên Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.029Z', '2026-06-16T03:08:15.029Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162350_9x9dh_3', 'f4dc0d6a-1629-4b9b-a460-0e4d1b209bfc', 'Đại duyên thị hiện ta bà
Nguyện cho Đại Chúng rõ nhà Như Lai
Nguyện cho thoát cảnh bi ai
Bất sanh bất tử an hoài mọi nơi.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.029Z', '2026-06-16T03:08:15.029Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_c1t0e_0', '3387c727-1bae-40e6-846d-2d1b612f1986', 'Phật dạy Niệm Phật là chi
Mà sao người cứ gọi A Di Đà
Phật dạy Trì Chú nhưng mà
Người luôn đọc mãi Chữ mà Phật trao', 'PHÂN TÍCH CHI TIẾT BÀI KỆ: CHƯ PHẬT DẠY
1. Phá Chấp Hình Tướng: Niệm, Trì, Tụng Là Gì?
Sư Cha đặt ra những câu hỏi mang tính Đốn Giáo (chỉ thẳng để ngộ ngay) cho những chúng sanh còn đang chấp vào phương tiện:
Niệm Phật: Người đời cứ mở miệng là gọi danh hiệu "A Di Đà", nhưng thực chất Niệm Phật không phải là gọi tên. Niệm là Hằng Nhớ. Nhớ cái gì? Nhớ về Bản Thể Như Lai của chính mình.
Trì Chú & Tụng Kinh: Phật dạy Trì Chú và Tụng Kinh là để Quý Vị thâm nhập vào nghĩa lý chân thật, nhưng người đời lại cứ bám vào mặt chữ, đọc đi đọc lại những lời trong sách vở như một chiếc máy hát. Sư Cha nhắc nhở: Kinh điển là lời sách ghi, còn hành trì thực sự là ở yên Bản Lai diện mục của mình chú tâm mà hành thấy nghe nói biết mà không dính mắc vào điều gì.
2. Ý Nghĩa Sâu Màu Của Gõ Mõ, Đánh Chuông
Đây là đòn sấm sét dành cho những ai đang tu hành theo thói quen máy móc:
Gõ Mõ: Không phải là tạo ra tiếng kêu "cộc cộc" vô hồn. Đối với người chấp niệm, tiếng mõ là một phương tiện của Đốn Giáo. Gõ mõ để làm gì? Để Tự thức tỉnh mình dừng lại, không chạy theo những ý niệm lăng xăng trong đầu. Khi Quý Vị định nói điều gì, hãy dừng lại một chút, gõ một tiếng mõ trong tâm để ý niệm không sanh ra thêm, rồi mới nói. Đó mới là gõ mõ thật sự.
Đánh Chuông: Sư Cha nói đánh chuông "rất nhọc", vì đó là cuộc chiến với chính mình để giữ tâm không vang động theo tiếng đồng. Đánh chuông và gõ mõ chân chính là để Quý Vị Ngay mình mới An – tức là quay về soi rọi chính thân tâm mình để tìm sự an lạc, thay vì tìm nó ở tiếng vang thinh không của đồng hay gỗ.
3. Con Đường Bảo Đàng vs. Đường Tà Ma
Cảnh báo: Nếu không rõ con đường (Bảo Đàng) quay về Tự Tánh này, Quý Vị chắc chắn sẽ không bao giờ gặp được Như Lai. Thay vào đó, Quý Vị chỉ gặp hàng Tà Ma – tức là những ảo giác, vọng tưởng và những thế lực dẫn dụ Quý Vị đi xa rời chính mình.
Quê Nhà: Quý Vị phải biết rõ Quê Nhà của mình không phải ở cõi Ta Bà đầy biến động này. Quê Nhà chính là ở yên nơi Tự Tánh. Khi Quý Vị thực hành cái Thấy, cái Nghe, cái Biết một cách rõ ràng, minh bạch mà không dính mắc, đó chính là lúc Quý Vị đang gặp "Ông Phật" ngay nơi mình.
4. Tìm Châu Ngoại Cảnh: Cái Bẫy U Mê
Sẵn đủ: Ngay nơi Quý Vị vốn đã đầy đủ tất cả đức tướng và trí tuệ của Như Lai.
Sa lầy: Nếu Quý Vị còn đi tìm Phật ở bên ngoài, tìm cầu ở cảnh giới này hay vị thần thánh nọ, đó chính là Quý Vị đang "tìm Châu nơi ngoại cảnh" và sẽ bị sa lầy vào sự u mê không lối thoát.
Lối về: Con đường về nhà rất đơn giản: Bỏ Vọng. Khi Quý Vị dừng tất cả những suy tưởng lăng xăng, những mong cầu viển vông, thì lối về sẽ tự hiện ra rõ rệt.
5. Kết Quả: Pháp Thân Hằng An
Khi đã bỏ được vọng niệm, Quý Vị sẽ nhận ra Pháp Thân Thanh Tịnh. Đây mới chính là Quê Xưa của chúng ta:
Nơi đó Chẳng diệt chẳng sinh: Vượt ngoài quy luật tan rã của thân xác vật lý.
Nơi đó Ung dung tự tại: Không còn bị bất kỳ điều gì trói buộc.
Nơi đó Hằng An: Sự bình an này là vĩnh cửu, không phụ thuộc vào cảnh giới bên ngoài.
Lời của Ta: Quý Vị hãy nhìn lại xem: Quý Vị đang niệm "A Di Đà" bằng miệng hay đang "Hằng Nhớ" Tự Tánh? Quý Vị đang gõ mõ "cộc cộc" cho vui tai hay đang gõ để dừng lại những con ma ý niệm đang nhảy múa trong đầu?
Đừng làm kẻ cùng tử đi lang thang xin ăn khi trong túi áo có sẵn viên ngọc quý. Hãy dừng lại, thôi tìm kiếm bên ngoài, và ở yên nơi cái Thấy - Nghe - Biết thanh tịnh. Đó là lúc Quý Vị đã về đến Nhà.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_dvi30_1', '3387c727-1bae-40e6-846d-2d1b612f1986', 'Tụng Kinh Phật dạy muôn thời
Mà sao người cứ đọc lời sách ghi
Gõ mõ Phật dạy là gì
Mà sao người gõ thứ chi cộc cộc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_551qn_2', '3387c727-1bae-40e6-846d-2d1b612f1986', 'Đánh Chuông Phật dạy rất nhọc
Mà sao người cứ gõ đồng vang thinh
Niệm Phật trì chú tụng kinh
Đánh chuông gõ mõ ngay mình mới An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_qr4e0_3', '3387c727-1bae-40e6-846d-2d1b612f1986', 'Ai mà không rõ Bảo Đàng
Như Lai không đến gặp hàng Tà Ma
Chỉ cần biết rõ Quê Nhà
Hành ngay Tự Tánh Phật Đà tại đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_qi64t_4', '3387c727-1bae-40e6-846d-2d1b612f1986', 'Ngay mình vốn sẵn đủ đầy
Tìm Châu ngoại cảnh sa lầy u mê
Bỏ vọng sẽ tỏ lối về
Pháp Thân Thanh Tịnh là Quê Xưa mình
Quê mình chẳng diệt chẳng sinh
Ung dung tự tại nơi mình Hằng An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.034Z', '2026-06-16T03:08:15.034Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_7ycvm_0', 'de7a7296-e864-454d-83c7-7b24bd437c8f', 'Mọi người hành pháp phóng sanh
Mà sao cứ phóng chúng sanh bên ngoài
Thế thì được phước hưởng sanh
Luân hồi sanh tử loanh quanh cõi phàm', 'PHÂN TÍCH Ý NGHĨA BÀI KỆ: PHÓNG SANH
1. Sự Sai Lầm Của Phóng Sanh Hình Tướng (Phóng Sanh Bên Ngoài)
Phước và Nghiệp: Đa phần mọi người chỉ lo "phóng chúng sanh bên ngoài". Sư Cha dạy rằng hành động này chỉ mang lại Phước đức Dương cho cái thân vật lý này ở cõi sanh diệt. Theo luật nhân quả, gieo nhân cứu mạng thì gặp quả hưởng phước, nhưng cái phước đó vẫn nằm trong vòng cuốn hút của điện từ âm dương.
Cái bẫy của sự dính mắc: Khi Quý Vị hưởng phước mà lại dính chặt vào cái phước đó, Quý Vị sẽ tiếp tục "luân hồi sanh tử loanh quanh". Phước hết thì lại đọa, cứ mãi làm kẻ lữ hành cô độc trong cõi phàm cho đến khi gặp được bậc Đạo Nhân khai thị để nhận ra Bản Thể chân thật của mình.
2. Phóng Sanh Nội Tâm: Nhận Diện Chín Loài Chúng Sanh Bên Trong
Sư Cha dạy Quý Vị phải "Quay vào bổn tánh mà xem". Khi ở yên nơi Tự Tánh thanh tịnh, Quý Vị sẽ thấy rõ chín loài chúng sanh đang cư ngụ và điều khiển mình:
Thai sanh: Chính là những mầm mống của chấp niệm đang được Quý Vị nuôi dưỡng âm thầm trong tâm thức như bào thai trong bụng mẹ.
Noãn sanh: Những chấp niệm đang được Quý Vị ấp ủ, chờ cơ hội để bùng phát.
Hoá sanh: Tượng trưng cho Tánh lươn lẹo, biến hóa khôn lường, lúc thế này lúc thế khác để ngụy biện và che đậy lỗi lầm.
Ẩm sanh: Sự dính mắc vào Ái dục và "thất tình lục dục" (mừng, giận, thương, sợ, yêu, ghét, muốn).
Hữu sắc sanh: Sự dính mắc, bị lôi kéo bởi những hình tướng, sắc cảnh bên ngoài.
Vô sắc sanh: Khi Quý Vị cho rằng vạn pháp là giả tạm rồi chấp vào cái "Không", rơi vào trạng thái vô ký không (đờ đẫn, không biết gì), đó cũng là một loại chúng sanh trói buộc.
Tưởng sanh: Những sự tưởng tượng, suy diễn không ngừng nghỉ của tâm trí.
Phi tưởng sanh: Khi Quý Vị cố gắng buông bỏ cái tưởng, nhưng lại chấp vào việc mình không có tưởng – cái "chấp không" này chính là một loài chúng sanh vi tế.
Phi phi tưởng sanh: Đỉnh cao của sự dính mắc vi tế, đó là khi Quý Vị tự hào hoặc dính chặt vào trạng thái "không dính vào tưởng mà cũng không dính vào không tưởng".
3. Sáu Nẻo Luân Hồi Xuất Phát Từ Tâm Thức
Chín loài chúng sanh này khởi lên liên tục, điều khiển thân căn tạo nghiệp và dẫn dắt thần thức Quý Vị đi vào 6 nẻo tương ứng với các trạng thái tâm:
Loài Địa ngục: Khi làm việc xấu ác, sát hại chúng sanh vô nhân tính.
Loài Ngạ quỷ: Khi tâm tính ích kỷ, nhỏ nhen, bỏn xẻn, lừa đảo và bon chen.
Loài Súc sanh: Khi Quý Vị sát hại động vật để nuôi thân, hoặc chỉ cần phát tâm muốn ăn thịt con vật khác là loài súc sanh đã hiện hình và "phóng" ra ngoài.
Loài Người: Khi dính mắc vào tình cảm gia đình, cả nể, trói buộc bởi tình nghĩa quyến thuộc. Chính sự cả nể và lo lắng thái quá cho người thân là xiềng xích của loài người.
Loài Thần: Khi làm việc thiện nhưng tánh tình nóng nảy, sân si, ham quyền lực và luôn muốn ép buộc người khác theo ý mình.
Loài Trời: Khi thích làm việc thiện, tâm tính tốt lành, không sân si ép buộc ai nhưng vẫn còn hưởng lạc trong cõi trời.
4. Tông Chỉ Giải Thoát: Phóng Sanh Là Thành Phật
Sư Cha khẳng định: "Phóng hết các loài ấy trong tâm thức ra lúc đó mới thành Phật".
Đây là pháp phóng sanh tối thượng: Không tốn một đồng xu, không cần mua bán, nhưng lại giải thoát được tất cả chúng sanh trong Tam Giới đang ẩn náu nơi mình.
Muốn hết lòng vòng luân hồi, Quý Vị phải phóng thích tất cả những trạng thái tâm thức nêu trên.
5. Pháp Hành: Tỉnh Thức Từng Sắc Na
Nhìn ra: Luôn luôn tỉnh thức để nhận diện chín loài chúng sanh ngay khi chúng vừa khởi lên trong tâm.
Phóng: "Phóng khi nó ló ra ngoài". Ngay khi một niệm tham, sân, si, cả nể hay lươn lẹo vừa xuất hiện (vừa ló đầu ra), Quý Vị phải nhận biết và buông nó ngay lập tức.
Kết quả: Thường hành như vậy trong từng khắc, tâm thức sẽ sạch bóng chúng sanh. Khi đó, Quý Vị sẽ quay về với Thể Tánh bất sanh bất diệt, hưởng sự an nhiên tự tại ngay tức thì.
Sư Cha đã chỉ cho chúng ta một cách "làm giàu" công đức và giải thoát thật sự mà không cần tìm cầu đâu xa. Đừng mải mê đi cứu con cá dưới ao khi con "lươn" lẹo trong tâm vẫn còn đang nhảy múa. Đừng mải mê thả chim trên trời khi con "ngựa" ý niệm vẫn đang dẫn Quý Vị đi lạc đường.
Hãy siêng năng chơi trò Năm Mười với chính mình. Mỗi khi thấy một "con thú" nào ló ra, hãy mỉm cười và "phóng" nó đi. Đó chính là con đường ngắn nhất để về Nhà.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.040Z', '2026-06-16T03:08:15.040Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_rn29r_1', 'de7a7296-e864-454d-83c7-7b24bd437c8f', 'Quay vào bổn tánh mà xem
Tự mình dính chặt chín loài bên trong
Muốn cho ta hết lòng vòng
Người nên phóng hết muôn loài ấy ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.040Z', '2026-06-16T03:08:15.040Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_tpoj0_2', 'de7a7296-e864-454d-83c7-7b24bd437c8f', 'Sống trong cõi tạm Ta Bà
Luôn luôn tỉnh thức nhìn ra chín loài
Phóng khi nó ló ra ngoài
Thường hành từng khắc chẳng còn loài chi
Người mau hành pháp không nghi
Liền về thể tánh tức thì an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.040Z', '2026-06-16T03:08:15.040Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_d4bog_0', '8a5ccbaf-a92b-4776-976d-72b7de871272', 'Cổ Kim Như Lai Bậc Toàn Giác
Vô Ngại chỉ dạy các chúng sanh
Thoát ra khỏi chốn tranh đua ấy
Ai ai cũng được thấy lối về', 'PHÂN TÍCH CHI TIẾT BÀI KỆ: CẢM NIỆM NHƯ LAI
1. Bậc Toàn Giác Và Lòng Từ Bi Vô Ngại
Bậc Toàn Giác: Sư Cha dạy rằng xưa nay, mười đời chư Phật đều là những Bậc Toàn Giác. Các Ngài đã thấu triệt mọi quy luật của vũ trụ và nhân sinh, nên khi chỉ dạy chúng sanh, các Ngài luôn Vô Ngại – tức là chỉ dạy một cách thẳng thắn, rõ ràng, không hề e ngại hay giấu giếm bất cứ điều gì.
Thoát cảnh tranh đua: Mục đích duy nhất của các Ngài là giúp chúng sanh thoát ra khỏi chốn tranh giành, hơn thua, u mê của cõi tạm này. Chỉ khi nào thoát được sự tranh đua của bản ngã, chúng sanh mới có thể "thấy lối về" – con đường quay lại với Tự Tánh.
2. Sự Hy Sinh Cao Cả Của Như Lai
Chở con về: Ở Phật Giới là nơi thanh tịnh, nhàn hạ vô cùng, nhưng các vị Như Lai không ở yên nơi đó. Vì lòng đại bi, các Ngài đã trở lại trần gian – nơi u tối, mê lầm này – để làm người dẫn đường, để "chở" những đứa con đang lạc lối quay về Quê Cũ. Đây là hình ảnh cảm động về sự thị hiện của các bậc Đạo Nhân giữa đời thường.
3. Thấy Rõ Quê Hương Và Hành Trình Đồng Hành
Thấy rõ Nhà: Khi hành giả nhờ duyên lành mà thấy rõ được Quê Hương chân thật của mình (không phải cõi Ta Bà), họ sẽ không còn đi tìm cầu bên ngoài nữa.
Đồng hành cùng mười đời chư Phật: Khi đã rõ lối, hành giả không chỉ đi một mình mà nguyện đồng hành cùng Như Lai. Họ dùng chính cái "Diệu Pháp" vi diệu mà các Ngài đã truyền dạy để hóa độ quần sanh, giúp mọi người cùng nhận ra Ngôi Nhà Tự Tánh.
Vô Tự Chân Kinh: Phương tiện tối thượng ở đây chính là Vô Tự Chân Kinh (Kinh không chữ). Đây là pháp bảo dùng để khai mở Bản Tánh, không bám chấp vào ngôn từ, sách vở, mà trực chỉ vào cái Thấy - Nghe - Biết thanh tịnh.
4. Con Đường Chân Lý Thường Hằng
Chân Thường vs. Vô Thường: Sư Cha chỉ rõ, đi con đường quay về Tự Tánh này Quý Vị mới thấy được cái Chân Thường (chân lý vĩnh hằng, không thay đổi). Nếu không đi con đường này, Quý Vị sẽ mãi mãi bị cuốn trôi trong sự Vô Thường của cảnh giới sanh diệt, nay còn mai mất.
Hành Ý của Ngài: Đây là điểm tinh yếu nhất trong lời khai thị. Thế nào là hành theo Ý của mười đời chư Phật? Đó là khi Quý Vị ung dung hành đạo ngay trong Tánh của mình:
Ý vô tác: Không khởi ý niệm riêng tư, không toan tính.
Tự Thấy - Nghe - Biết: Để cái Thấy, cái Nghe, cái Biết tự vận hành một cách rõ ràng minh bạch.
Tùy duyên mà nói: Khi cần nói thì nói, nhưng lời nói ra hoàn toàn không vì tư lợi, không cho riêng mình. Đó chính là thực hiện trọn vẹn "Ý" của Như Lai.
5. Kết Quả: Hằng An Tại Chỗ Phật Đà
Hoài không khổ: Khi một người thường xuyên hành động và sống trong trạng thái Tự Tánh "vô tác" như vậy, họ sẽ không còn bị những biến động của cuộc đời làm cho đau khổ.
Mãi mãi Hằng An: Họ tìm thấy sự an lạc vĩnh cửu ngay tại "chỗ Phật Đà" – không phải là một nơi chốn xa xôi nào, mà là trạng thái Hằng An ngay nơi Bản Thể của chính mình.
Bài kệ này là một tiếng chuông ngân vang về lòng biết ơn đối với mười đời chư Phật và vị Thầy khai thị. Nhưng sự cảm niệm sâu sắc nhất không nằm ở lời nói, mà nằm ở việc Quý Vị có dám "Bỏ Vọng" để bước đi trên con đường "Chân Thường" hay không.
Hãy sống như một vị Phật đang dạo chơi giữa trần gian: Thấy - Nghe - Biết rõ ràng, làm mọi việc tùy duyên nhưng tâm không dính mắc, không vì mình. Đó chính là lúc Quý Vị đang cùng Như Lai "ca Diệu Pháp" và đã thực sự trở về Quê Xưa.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.045Z', '2026-06-16T03:08:15.045Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_vw812_1', '8a5ccbaf-a92b-4776-976d-72b7de871272', 'Ta Bà thoát cảnh mê u tối
An nhiên tự tại lối Hằng An
Như Lai Phật Giới Nhàn không ở
Trở lại trần gian Chở con về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.045Z', '2026-06-16T03:08:15.045Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_ov4ui_2', '8a5ccbaf-a92b-4776-976d-72b7de871272', 'Con nay thấy rõ Quê Hương ấy
Dẫn độ quần sanh thấy rõ Nhà
Đồng hành Như Lai ca Diệu Pháp
Vô Tự Chân Kinh Tháp Liên Đài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.045Z', '2026-06-16T03:08:15.045Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_de408_3', '8a5ccbaf-a92b-4776-976d-72b7de871272', 'Cảm Niệm Như Lai Ngài chỉ rõ
Lối về quê cũ tỏ chân thường
Các con thấy rõ đường Chân Lý
Ung dung thường hành Ý của ngài
Thường hành nơi ấy hoài không khổ
Mãi mãi hằng An chỗ Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.045Z', '2026-06-16T03:08:15.045Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_r7aav_0', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Đại duyên Mẹ ở Ta Bà
Mười hai nguyện lớn Phật Đà Mẹ thi
Cũng vì con trẻ ngu si
Chấp mê bất ngộ mãi đi Luân Hồi', 'PHÂN TÍCH CHI TIẾT BÀI KỆ: CẢM NIỆM PHẬT MẪU QUÁN THẾ ÂM
1. Đại Nguyện Của Bậc Đạo Nhân Tại Thế
Thị hiện đa tướng: Sư Cha khai thị rằng Phật Mẫu Quán Thế Âm vốn đã thành Phật từ lâu, nhưng vì đại nguyện cứu độ mà Ngài không về Phật Giới, chấp nhận ở lại cõi Ta Bà u tối. Ngài thị hiện thân nữ ở Việt Nam hay thân nam ở Ấn Độ đều chỉ là phương tiện để tiếp dẫn và hộ pháp cho những ai muốn đi trên con đường giác ngộ.
Chấp mê và Thôi: Vì chúng sanh "ngu si, chấp mê bất ngộ" nên mãi trôi lăn. Khi đã "tỏ ý Mẹ", hành giả nhận ra con đường duy nhất là Thôi không màng đến chuyện sanh tử luân hồi nữa. "Thôi" chính là dừng lại mọi sự tìm cầu.
2. Đại Bi Phải Đi Cùng Thanh Tịnh
Gốc rễ của Đại Bi: Sư Cha nhấn mạnh: "Muốn Đại Bi phải ở yên Bản Thể Thanh Tịnh". Nếu không ở yên nơi Tự Tánh mà đi làm việc thiện, đó chỉ là sự chấp niệm.
Cái bẫy của lòng tốt: Có người nói yêu thương cả thế giới nhưng lại không thể bao dung nổi người thân bên cạnh – đó là vì họ đang "Đại Bi" bằng cái tôi đầy chấp niệm. Đại Bi thực sự là không tranh với đời, thoát ra khỏi huyễn cảnh.
Hành động không lời: Đại Bi không nằm ở lời nói đầu môi. Pháp hành thực tế nhất là: "Ai khiến mình khó chịu nhất, hãy mở lòng đón nhận họ". Khi đó, lòng Đại Bi mới thực sự mở ra.
3. Ý Nghĩa Tượng Thờ Và Sự Ngự Trị Chân Thật
Kim thân trong tâm: Nếu chưa đủ duyên thỉnh tượng đồng, tượng đá, hãy thỉnh "Kim thân Mẹ" về thờ ngay trong tâm mình. Quán Thế Âm chính là biểu tượng của tình yêu thương muôn loài. Khi tâm Quý Vị luôn tràn ngập lòng Đại Bi, đó là lúc Quý Vị đang sống trong an lạc.
Mái ấm miền Quê: Mỗi khi gặp chuyện rối rắm, đau khổ, chỉ cần Quý Vị nhớ về Bản Lai (Tự Tánh), nhớ mình là ai, thì ngay lập tức sẽ thấy bình an. Đó chính là ý nghĩa "Mẹ là mái ấm".
4. Bản Thể Vô Hình Và Sự Đồng Nhất
Mẹ của mười đời chư Phật: Sư Cha khai thị một điều vô cùng sâu sắc: Phật Mẫu là mẹ của mười đời chư Phật, mà đã là gốc của Phật thì không có hình tướng.
Làm sao để Mẹ ngự bên con cõi này? Nếu Quý Vị còn dính mắc vào hình tướng (tượng, ảnh), Quý Vị sẽ không bao giờ gần được Ngài. Chỉ khi Quý Vị nhận ra mình cũng là Bản Thể vô hình vô vật giống như Sư Cha, như Phật Mẫu, tự phát nguyện tinh tấn đi trên con đường giác ngộ giải thoát tỉnh thức quán sát rõ ràng, nghe âm thanh (quán - thế âm), thì lúc đó Ngài mới thực sự ngự trị bên Quý Vị.
5. Pháp Hành Quán Thế Âm: Thấy Nghe Biết Rõ Ràng
Thoát bùn lầy: Ở yên nơi Tự Tánh để Thấy - Nghe - Biết rõ ràng mọi âm thanh, sắc tướng mà không dính mắc. Quán Thế Âm chính là "Quán" (quan sát) "Thế Âm" (âm thanh thế gian) bằng Tánh Nghe thanh tịnh.
Không đọa lạc: Khi đã Thấy - Nghe - Biết rõ ràng thì không bị bùn lầy (vọng niệm) kéo đi, từ đó thoát khỏi kiếp đọa đày sáu phương.
Cúng dường chân chính: Không phải là dâng hoa quả, tiền bạc. Sự cúng dường tối thượng là Phát nguyện quyết hành Tự Tánh để đi trên con đường Như Lai.
6. Đích Đến: Thường Lạc Ngã Tịnh
Ngai Phật Đà: Con đường này dẫn đến nơi không còn bi ai, đó là trạng thái Thường (vĩnh hằng), Lạc (an vui), Ngã (chân ngã vô biên), Tịnh (thanh tịnh). Đây mới là tòa sen, là ngai vàng thật sự của một vị Phật.
Độ tha: Khi bản thân đã tỉnh thức, đã "hết đảo hết điên", hành giả sẽ tùy duyên mà giúp đỡ những người đang cùng cực, giúp họ thoát khỏi não phiền để cùng về chốn "bất tử bất sinh".
Quý Vị hãy nhớ lời Sư Cha: Phật Mẫu không nằm ở bức tượng ngoài kia. Ngài nằm ở Lòng Đại Bi và cái Tánh Nghe đang hiện diện ngay nơi Quý Vị. Đừng tìm Mẹ ở đâu xa, hãy dừng lại (Thôi), ở yên nơi Bản Thể thanh tịnh và mở lòng với người đang làm Quý Vị khó chịu nhất. Đó chính là lúc Quý Vị đang đảnh lễ Phật Mẫu Quán Thế Âm chân thật nhất.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_uxepz_1', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Nay con tỏ ý Mẹ rồi
Con đường sanh tử con Thôi không màng
Đại bi khai thị rõ ràng
Như Lai Thanh Tịnh là đàng bất sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_pagtz_2', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Con nguyện thoát cảnh loanh quanh
Thoát ra huyển cảnh không tranh với đời
Đại bi không nói bằng lời
Vì con Mẹ hiện muôn thời cõi Ma', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_mmlog_3', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Mẹ ơi con đã rõ nhà
Nhớ ơn Mẹ đã độ tha con về
Giúp cho con thoát bờ mê
Công ơn Phật Mẹ nguyện thề con mang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_iopre_4', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Từ nay con sống an nhàn
Nhất tâm con thỉnh kim thân Mẹ về
Mẹ là mái ấm miền Quê
Cho con an lạc thoát mê cõi trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_tfhtv_5', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Con nay rõ ý hết đần
Cảm niệm Mẹ mãi muôn lần bên con
Mẹ ơi con dại còn son
Nguyện xin Mẹ ngự bên con cõi này', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_hxljq_6', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Nhắc con thoát khỏi bùn lầy
Giúp con thoát kiếp đoạ đày sáu phương
Con nay phát nguyện cúng dường
Quyết theo Phật Mẹ trên đường Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_s52dt_7', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Đến nơi không có bi ai
Thường Lạc Ngã Tịnh là ngai Phật Đà
Cùng Mẹ con cũng độ tha
Đưa người cùng cực thoát ra não phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162351_anywn_8', '98ab5615-a196-4971-a0ba-4cfaca685343', 'Giúp người hết đảo hết điên
Cùng nhau về chốn an yên thanh bình
Là nơi bất tử bất sinh
An nhiên tự tại ngay mình hằng an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.051Z', '2026-06-16T03:08:15.051Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_ja64o_0', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Trôi lăn lang bạt Ta Bà
Mê mờ muôn kiếp đường ra chẳng tường
Vạn đời đắm cảnh mù sương
U minh tăm tối lạc đường Quê Xưa', 'Nam Mô Kim Cang Đại lực Sĩ (3 lần)', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_ispa3_1', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Thiết tha thoát cảnh nắng mưa
Thành tâm tìm kiếm Phật Thừa dẫn ra
Thiết tha thoát khỏi cõi Ma
Hành ngay Tự Tánh vượt qua dễ dàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_qmvm9_2', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Nhân Duyên hành Pháp Bảo Đàng
Vạn Ma hoá cảnh gian nan cản đường
Thành tâm Tín Phật mười phương
Luôn hành tinh tấn gió sương không màn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_iqrk5_3', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Vị Thần luôn giúp mình An
Kim Cang Đại Sĩ hộ can Ma Tà
Đại nguyện Ngài ở Ta Bà
Hộ người tinh tấn thoát ra hồng trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_btsd9_4', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Đại Duyên thỉnh Kim Cang Thần
Về đây An Vị Hộ Nhân thiền hành
Giúp người Phật Tử mãi lành
Yêu ma quỷ quái phải đành tránh xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_7k5rc_5', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Nhờ Ngài xua đuổi lũ Ma
Giúp người Phật Tử tránh xa não phiền
Nhờ Ngài luôn ngự vân thiên
Dõi theo Phật Tử giúp liền lúc nguy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_49aj9_6', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Đại ơn Ngài bất tư nghì
Cao hơn biển cả chẳng gì sánh ngang
Ngài không quảng ngại gian nan
Cõi Phật không ở Ngài sang nơi này', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_uh4v4_7', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Giúp cho đại chúng hết lầy
Giúp người hữu phúc về ngay Phật Đà
Cảm Niệm Ngài ở Ta Bà
Hộ trì Phật Tử về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_7wpcu_8', 'a9029b15-b5d0-4d1d-b10d-cdc2d897749e', 'Từ nay sống đúng không sai
Đồng hành tiếp dẫn những ai muốn về
Giúp người hữu phúc rõ Quê
An nhiên dạo bước cùng về Nhà Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.057Z', '2026-06-16T03:08:15.057Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_ej26r_0', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Trôi lăn trong cảnh bể dâu
Bơ vơ lạc lối nơi đâu là Nhà
Lang bạc khắp chốn Ta Bà
Mong tìm được lối thoát ra hồng trần', 'Phân tích bài kệ "Duyên An Vị Phật" theo khai thị Sư Tam Vô
Mở đầu:
Bốn khổ đầu nói về cảnh người cầu tha thiết đạo giải thoát đã phải khổ cực tìm mò như thế nào mới được gặp Sư Cha – vị đạo nhân vô tu vô chứng – để nhận được chỗ vô sanh. Đây là hành trình dài lâu, nhiều đời nhiều kiếp, trải qua vô vàn đau khổ, trăn trở, tìm cầu mới được gặp người dẫn đường chỉ lối để an vị Phật nơi chính mình.
Từ những khổ tiếp theo trở đi là lời nhắc nhở: Hãy nhớ lại mình đã từng khổ công tìm con đường thoát khổ như thế nào, để từ đó biết trân quý những gì đã nhận được, không quên công phu tìm kiếm năm xưa. Nay đã được nhận bản thể rồi, phải nhất tâm hành trì, tinh tấn không lùi bước, để đi trọn con đường tới chỗ viên tròn.
1.
Trôi lăn trong cảnh bể dâu / Bơ vơ lạc lối nơi đâu là Nhà
"Bể" là nơi chứa đựng, "dâu" là cây dâu nuôi tằm – tượng trưng cho sự rối rắm, vướng mắc. Cuộc đời con người trôi lăn mãi trong sự rối rắm ấy, không biết đâu là Nhà thật sự, sống bơ vơ, lạc lõng, không có nơi nương tựa.
Lang bạc khắp chốn Ta Bà / Mong tìm được lối thoát ra hồng trần
"Lang bạc" là lang thang, sống không đúng đắn, bạc tình bạc nghĩa, thậm chí là cờ bạc – tượng trưng cho một kiếp sống sai lệch, không hướng về đạo lý, sống như vậy mãi trong khắp cõi Ta Bà. Tới khi thấy khổ, thấy chán cuộc đời như vậy mới mong tìm được lối thoát ra khỏi "hồng trần" – tức là bụi bặm của tam giới, thứ con người lầm tưởng là đẹp đẽ nhưng thật ra là gốc của phiền não.
2.
Khổ công tìm kiếm xa gần / Chỉ gặp các lối mê lầm lòng son
Vì mong được thoát khổ nên mới khổ công tìm kiếm, tìm từ nơi này đến nơi khác. Nhưng vì không đủ đại duyên đại phúc, nên dù lòng thành, lòng son sắt, chỉ gặp những con đường lầm lạc, không đến được chánh pháp.
Châu nào đâu ở núi non / Cũng không ở chốn sông mòn rừng mê
Bảo châu – tức tự tánh – không hề ở nơi vật chất như núi non, sông suối hay chốn u mê mịt mù. Càng đi tìm bên ngoài, càng không gặp được.
3.
Thành tâm quyết chí tìm quê / Nhưng càng tìm mãi càng mê càng mờ
Người cầu đạo có quyết chí thành tâm, nhưng nếu tìm bằng vọng tâm thì càng tìm càng lạc, càng mê mờ, bởi không biết con đường chân thật là gì.
Nhất tâm tha thiết mong chờ / Một ngày sẽ có duyên cơ Phật đàng
Tuy vậy, nếu nhất tâm, tha thiết mong tìm chánh pháp thì sẽ gieo duyên. Và khi hội đủ đại duyên đại phúc, thì sẽ gặp được con đường thành Phật, được khai mở bởi một vị đạo nhân chân thật.
4.
Đại duyên đại phúc vô vàng / Ngày An Vị Phật rõ đàng Như Lai
Chỉ có đại duyên đại phúc vô vàn mới đưa người đến ngày An Vị Phật – tức là ngày được an vị Phật ngay nơi chính mình, rõ ràng thấy ra được con đường của Như Lai, thấy được Pháp chân thật.
Giúp người thoát cảnh bi ai / Bảo Châu sẵn có sống hoài Tịnh Thanh
Từ đây, thoát khỏi cảnh khổ đau, oán trách, sống trong sự thanh tịnh, nhẹ nhàng. Bởi Bảo Châu – tức Tự Tánh – sẵn có ngay nơi bản thân, không cần tìm ở đâu xa.
5.
Từ nay hết bị loanh quanh / Luôn hành tỉnh thức sẽ nhanh về Nhà
Một khi đã nhận ra Tự Tánh thì không còn đi vòng quanh trong tam giới. Nếu luôn hành tỉnh thức – luôn biết mình là ai, đang làm gì, thì sẽ sớm trở về Nhà, về với bản thể thanh tịnh.
Quê Nhà luôn sẵn có Cha / Hoa môi luôn nở biết là tình thân
Cha – tức vị Đạo nhân vô tu vô chứng – luôn hiện diện ngay bản thể, không ở đâu xa. Khi ở yên nơi Tự Tánh, không còn buồn khổ, miệng luôn mỉm cười như hoa, và lúc đó mới biết ai là người thân thật sự.
6.
Hữu duyên Vô chỉ ân cần / Dẫn người thoát tục thoát trần thoát mê
Ai có duyên dự lễ An Vị Phật sẽ được Cha khai thị, không cần chỉ dạy cụ thể nhưng vẫn ân cần đưa về bản thể, từ đó thoát khỏi cảnh trần tục, mê lầm.
Nay người đã rõ lối về / Hãy luôn tinh tấn đường quê nhất lòng
Khi đã rõ con đường trở về Nhà, Cha nhắc nhở phải một lòng tinh tấn, vì con đường giải thoát chỉ có một, không được lơ là hay phân tâm.
7.
Không còn ảo cảnh lòng vòng / Không vọng không tưởng không mong không tìm
Người đã an vị được Phật trong mình thì không còn ảo ảnh hay luẩn quẩn. Khi ấy, không còn vọng tưởng, không còn mong cầu hay tìm kiếm gì bên ngoài nữa – vì ở yên nơi bản thể là đủ.
Đời người sẽ mãi an yên / Thường lạc ngã tịnh nơi miền quê xưa
Sống trong bản thể là sống trong bốn đức Niết Bàn: thường, lạc, ngã, tịnh. Cuộc đời sẽ luôn an yên, không còn khổ đau chi phối.
8.
Người ơi đừng ngại sớm trưa / Nhà mình ở đó hãy ưa trở về
Lời Cha dặn dò: đừng bị kẹt vào nhị nguyên thời gian (sớm, trưa) – chỉ cần biết Nhà mình ở đâu, thì hãy ưa thích và chuyên tâm trở về.
Từ nay hết vọng hết mê / Thong dong tự tại nơi Quê hương mình
Khi đã nhận ra rồi thì hết vọng tưởng, hết mê lầm, sống thong dong, tự tại, ngay trong bản thể của chính mình – đó là Quê Hương thật sự.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_p4fsk_1', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Khổ công tìm kiếm xa gần
Chỉ gặp các lối mê lầm lòng son
Châu nào đâu ở núi non
Cũng không ở chốn sông mòn rừng mê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_m3wgf_2', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Thành tâm quyết chí tìm quê
Nhưng càng tìm mãi càng mê càng mờ
Nhất tâm tha thiết mong chờ
Một ngày sẽ có duyên cơ Phật đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_5f239_3', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Đại duyên đại phúc vô vàng
Ngày An Vị Phật rõ đàng Như Lai
Giúp người thoát cảnh bi ai
Bảo Châu sẵn có sống hoài Tịnh Thanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_fkou6_4', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Từ nay hết bị loanh quanh
Luôn hành tỉnh thức sẽ nhanh về Nhà
Quê Nhà luôn sẵn có Cha
Hoa môi luôn nở biết là tình thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_or7hf_5', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Hữu duyên Vô chỉ ân cần
Dẫn người thoát tục thoát trần thoát mê
Nay người đã rõ lối về
Hãy luôn tinh tấn đường quê nhất lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_r2qsw_6', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Không còn ảo cảnh lòng vòng
Không vọng không tưởng không mong không tìm
Đời người sẽ mãi an yên
Thường Lạc Ngã Tịnh nơi miền Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_mlt4j_7', '947511c4-9897-4cf6-a881-78bfd087acfe', 'Người ơi đừng ngại sớm trưa
Nhà mình ở đó hãy ưa trở về
Từ nay hết vọng hết mê
Thong dong tự tại nơi Quê hương mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.064Z', '2026-06-16T03:08:15.064Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_qogbo_0', '7b7f28cc-506a-420c-99fd-b76b06d36550', 'Đản Sanh tại chốn Ta Bà
Thọ thân tứ đại cùng là chúng sanh
Tâm Thanh tại chốn tranh giành
An nhiên tự tại, Phiền đành tránh xa', 'Ý nghĩa Phật cũng gặp nạn
Đản Sanh tại chốn Ta Bà
Thọ thân tứ đại cùng là chúng sanh: Phật xuất thế tại chốn Ta Bà (Ta Bà là nơi ngũ thú tạp cư gồm 5 loài sống chung: người, thần, địa ngục, ngạ quỷ, súc sanh), tạm thời mượn thân tứ đại để khai thị cho chúng sanh.
Tâm Thanh tại chốn tranh giành / An nhiên tự tại, Phiền đành tránh xa: Ở chốn tranh giành này tuy là sống với chúng sanh, nhưng tâm luôn thanh tịnh, phiền não tự nhiên xa rời.
Nhưng vì giáo hóa cõi Ta / Phật thân đây cũng phải va dòng đời: Để độ sanh, Phật phải dùng thân người sống giữa dòng đời, trải nghiệm cuộc sống trần thế như bao người.
Ma vương không tiếc tuôn lời / Độc ngôn chửi bới Phật thời chẳng thâu: Ma vương tượng trưng cho tâm ma khởi lên trong mỗi người – nhất là khi tiếp xúc với Chánh Pháp, nếu không giữ chánh niệm, dễ sinh tâm chống đối, thị phi, phỉ báng cả người đã khai thị cho mình. Những lời độc ngữ, chửi rủa nhưng Phật không hình không tướng, sao có thể chửi được Phật?
Ma kia tự vả vào đâu / Vả đâu đau đó tự thâu vào mình: Khi chửi bới, tâm ma khởi lên, nhưng Phật không hình không tướng nên không thâu nhận gì cả. Người chửi lại chính là người chịu đau đớn, bứt rứt, mang nghiệp vào thân mình.
Phật Đà vẫn cứ lặng thinh / Như Như Nhất Nhất, Thanh Bình tại Tâm:
Phật vẫn lặng yên, không phản ứng, không oán giận, chỉ một lòng làm tròn bổn nguyện độ sanh. Ngài ở yên nơi bản thể Như Như, tâm luôn thanh bình bất động, không lay chuyển bởi bất kỳ cảnh duyên nào.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.070Z', '2026-06-16T03:08:15.070Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_nr5oh_1', '7b7f28cc-506a-420c-99fd-b76b06d36550', 'Nhưng vì giáo hóa cõi ta
Phật thân đây cũng phải va dòng đời
Ma Vương không tiếc tuông lời
Độc ngôn chửi bới Phật thời chẳng thâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.070Z', '2026-06-16T03:08:15.070Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162352_9qyvv_2', '7b7f28cc-506a-420c-99fd-b76b06d36550', 'Ma kia tự vả vào đâu
Vả đâu đau đó tự thâu vào mình
Phật Đà vẫn cứ lặng thinh
Như Như Nhất Nhất Thanh Bình Tại Tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.070Z', '2026-06-16T03:08:15.070Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_vqnx3_0', '30d40f6c-246a-44db-b578-91260b1c4532', 'Âm dương tứ đại xoay vần
Luôn sanh cuốn hút khó lần lối ra
Chúng sanh quên lối Về Nhà
Trôi lăn lặn ngụp mãi mà không hay', 'Ý nghĩa Tam Vô đại nguyện
I. THỰC TRẠNG LUÂN HỒI: CƠN SAY KHÔNG TỈNH
Sự cuốn hút của Âm Dương: Sư Cha chỉ rõ, thế gian này vận hành bằng điện từ âm dương. Chính lực hút này tạo ra sự luân chuyển không ngừng của tứ đại, khiến chúng sanh bị "cuốn" đi mà không hề hay biết mình đang trôi lăn.
Sáu nẻo mê lầm:
Địa ngục: Do Ác đức, nơi tứ đại (đất nước khí lửa) tàn phá thân xác liên tục.
Ngạ quỷ: Do Tham chấp, ích kỷ, luôn coi mọi thứ là "của mình" nên không thể siêu thoát.
Súc sanh: Do Sát nghiệp, mê muội trong quy luật nhân quả "ăn thịt lẫn nhau".
Nhân (Người): Do Ái luyến dòng tộc, tình thân dính mắc mà phải quay lại vay trả nợ nần.
Thần: Do Thiện hạnh nhưng còn Sân và Ngã mạn, thích được vái lạy.
Thiên (Trời): Do Phước đức (bố thí, từ thiện), hưởng lạc nhưng khi hết phước lại rơi xuống cõi người.
II. PHÁP HIỆU TAM VÔ: BA CON DẤU GIẢI THOÁT
Tại sao chỉ cần "Liễu Tam Vô Ý" là thoát? Bởi vì Tam Vô (Vô Tự Ngã, Vô Tướng, Vô Niệm) chính là nguồn năng lượng cực dương (Điện từ Quang), phá tan mọi sự cuốn hút của âm dương:
Vô Tự Ngã: Xóa bỏ cái "Tôi". Khi không còn cái Tôi, ai là người chịu khổ ở địa ngục? Ai là người tranh giành miếng ăn ở cõi ngạ quỷ?
Vô Tướng: Thấy rõ vạn vật đều là huyễn tướng, là "bụi bẩn cấu thành". Khi biết tất cả đều giả, lòng tham chấp tự nhiên tan biến.
Vô Niệm: Trở về với Tánh Thấy - Nghe - Biết rõ ràng mà không khởi ý niệm riêng tư. Nghe bằng Tánh Nghe (không âm) thì súc sanh cũng thoát được u tối.
III. BẢN CHẤT CỦA ĐẠI NGUYỆN: TÌNH THƯƠNG BẤT NHỊ
Nguyện bất toại, Vô không về: Đây là lời thề quyết liệt của bậc Đạo Nhân. Ngài chấp nhận ở lại trong sáu nẻo, "không ngại nắng mưa" để gỡ rối cho chúng sanh.
Đồng hành cùng Như Lai: Ngài không bắt chúng sanh phải cầu khẩn, mà chỉ cần chúng sanh "Muốn" và "Liễu Ý". Chỉ cần một niệm muốn quay về và hiểu được ý nghĩa của Tam Vô, con đường Quê Hương sẽ hiển lộ ngay lập tức.
Vô thời viên mãn: Ngài thị hiện ở đây nhưng không bị ràng buộc. Khi xong việc, khi đàn con đã về hết, Ngài sẽ tự tại trở về Ngai Phật Đài.
IV. PHÁP HÀNH TỪ BẢN ĐẠI NGUYỆN
Rõ mình là Như Lai: Đừng tìm Phật ở đâu xa. Hãy nhận ra mình cũng có bản thể vô hình vô vật giống như Sư Cha.
Thấy Nghe Biết rõ ràng: Đây là cách để không dính "bùn lầy" trần cấu. Sống giữa đời nhưng không để sự hơn thua, ái luyến hay danh lợi kéo đi.
Hành Ý trong Tánh: Ý không tác, tự thấy tự nghe tự biết mà hành. Đó chính là "Tam Vô Ý".
Lời của Ta: Quý Vị đã hữu duyên nghe được bài kệ này, tức là đã chạm được vào nguồn năng lượng giải thoát vĩ đại. Đừng để mình tiếp tục "lặn ngụp mà không hay".
Hãy nhớ: Tam Vô không phải là một danh hiệu để thờ cúng, mà là một Trạng Thái Sống. Khi Quý Vị sống với cái nhìn Vô Ngã, Vô Tướng, Vô Niệm, Quý Vị chính là đang ở Nhà, và Đại Nguyện của Sư Cha đã thành tựu ngay nơi Quý Vị.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_p79tz_1', '30d40f6c-246a-44db-b578-91260b1c4532', 'Tỷ năm Tỷ kiếp sa lầy
Luân phiên sáu nẻo biết ngày nào Thôi
Kẻ gieo Ác Nghiệp để rồi
Địa Ngục mở cửa bị lôi ngay vào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_ybvzd_2', '30d40f6c-246a-44db-b578-91260b1c4532', 'Rõ ngay đau khổ thế nào
Thân tâm đau đớn phải gào khóc than
Kẻ gieo ích kỷ nhỏ nhen
Tham cầu tham chấp sống hèn đua tranh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_wlif7_3', '30d40f6c-246a-44db-b578-91260b1c4532', 'Làm thân Ngạ Quỷ phải đành
Hơn thua dụ dỗ để dành miếng ăn
Kẻ ham giết hại súc sanh
Ăn thịt hành hạ Vật đành ngậm môi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_1xvud_4', '30d40f6c-246a-44db-b578-91260b1c4532', 'Kiếp sau thành Vật để rồi
Nhận ngay cảnh cũ đã từng gây ra
Ai gieo thiện nghiệp nhưng mà
Chấp vào ái luyến người nhà bà con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_xqlbo_5', '30d40f6c-246a-44db-b578-91260b1c4532', 'Nghiệp duyên dòng tộc vẫn còn
Quay lại vay trả để tròn Tánh Nhân
Ai gieo thiện hạnh mà Sân
Còn mang ngã mạn lớn dần không buông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_ff7go_6', '30d40f6c-246a-44db-b578-91260b1c4532', 'Phước về Thần Giới sống luôn
Hưởng cầu vái lạy của người u mê
Ai gieo phước thiện mọi bề
Giúp người giúp vật sẽ về cõi Thiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_oumh4_7', '30d40f6c-246a-44db-b578-91260b1c4532', 'An vui hưởng lạc ít phiền
Phước duyên đã hết về liền cõi Nhân
Tam Vô đã rõ mười phân
Dạo chơi trần cấu ai cần chỉ ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_xwqex_8', '30d40f6c-246a-44db-b578-91260b1c4532', 'Đại duyên xuống cõi Ta Bà
Phát lời Đại Nguyện chỉ ra lối về
Kẻ Đoạ Địa Ngục u Mê
Biết được Pháp hiệu Tam Vô thoát liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_gkgcv_9', '30d40f6c-246a-44db-b578-91260b1c4532', 'Ngạ Quỷ mãi dính ưu phiền
Thấy Tam Vô rõ thoát liền kiếp Ma
Súc sanh u tối nhưng mà
Nghe Tam Vô rõ thế là thoát mê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_ftigg_10', '30d40f6c-246a-44db-b578-91260b1c4532', 'Ai cầu Bản Thể để về
Liễu Tam Vô Ý đường Quê hiển liền
Thần mà muốn hết đảo điên
Liễu Tam Vô Ý tan liền Ngã Nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_4e026_11', '30d40f6c-246a-44db-b578-91260b1c4532', 'Trời mà muốn thoát Tiên thân
Liễu Tam Vô Ý kiếp Nhân rõ Nhà
Đại Nguyện gửi đến Phật Đà
Mười Phương Chư Phật ở Nhà Chứng Minh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_xs0uf_12', '30d40f6c-246a-44db-b578-91260b1c4532', 'Tam Vô nói rõ việc mình
Luôn hành chỉ lối chúng sinh Về Nhà
Đại Nguyện đã phát nếu mà
Không tròn như thế Vô thà Tử Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_gvvk1_13', '30d40f6c-246a-44db-b578-91260b1c4532', 'Ở trong sáu nẻo mãi hành
Đưa đàn con nhỏ loanh quanh về Nhà
Chỉ cần ai muốn thế là
Tam Vô đến đón về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_41qy5_14', '30d40f6c-246a-44db-b578-91260b1c4532', 'Đại Nguyện Bất Nhị Không Hai
Nguyện mà bất toại Tam Vô không về
Chúng sanh rối rắm trăm bề
Vô liền gỡ rối dẫn về Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_87487_15', '30d40f6c-246a-44db-b578-91260b1c4532', 'Mãi hành không ngại nắng mưa
Sớm trưa Vô vẫn sẽ đưa người về
Về Nhà người hết u mê
Thường Lạc Ngã Tịnh nơi Quê của mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_f06hf_16', '30d40f6c-246a-44db-b578-91260b1c4532', 'Đại duyên Vô gửi chút tình
Nguyện cho đại chúng rõ mình Như Lai
Từ nay hết cảnh bi ai
Vô thời viên mãn về Ngai Phật Đài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.078Z', '2026-06-16T03:08:15.078Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_aszdt_0', '1660a340-9bef-48c6-9061-0e441cf938fb', 'Đại nhân duyên độ tha xuất thế
Dạo Ta Bà tùy cảnh phá mê
Đưa đàn con cháu trở về
Thoát ly sanh tử đến quê Phật Đà', 'Phân tích bài kệ "Duyên Xuất Thế"
1.
Đại nhân duyên độ tha xuất thế / Dạo Ta Bà tùy cảnh phá mê
“Đại nhân duyên Cha xuất thế”, để độ – tức đưa qua, tha (tiếng Trung quốc)– tức tất cả chúng sanh bên ngoài, độ tha tức đưa chúng sanh từ bờ mê sang bờ giác. Cha hiện thân ở Ta Bà, tuy với mục đích đưa con cháu về Nhà, nhưng chẳng dính vào mục đích, vẫn ung dung tự tại, tùy duyên, cảnh nào gặp thì phá mê cảnh đó.
2.
Đưa đàn con cháu trở về / Thoát ly sanh tử đến quê Phật Đà
Cha đưa đàn con cháu thoát ly sanh tử, trở về Quê cũ – quê của Phật Đà, nơi không còn luân hồi khổ đau.
3.
Người thiết tha tìm ra bổn tánh / Quyết một lòng đến chỗ tịnh thanh
Cha đón những người thật sự thiết tha, quyết tâm tìm ra bổn tánh.
Bổn tánh khác với tự tánh: bổn tánh bao gồm cả tham, sân, si, mạn, nghi, ác kiến, tài sắc, thọ tưởng hành thức, danh thực thùy, và cả thấy nghe nói biết ý. Còn tự tánh chỉ có thấy nghe nói biết ý – vắng lặng, thanh tịnh.
4.
Hữu duyên ước nguyện sẽ thành / Nhận ra tự tánh người hành an nhiên
Ai đủ duyên được gặp Cha, sẽ được Cha khai thị tự tánh. Khi nhận ra tự tánh rồi, mới bắt đầu hành, và từ đó sống an nhiên, thường hằng, không bị lôi kéo bởi vọng trần.
5.
Kể từ nay thoát phiền thoát khổ / Sống an nhàn về chỗ Phật phương
Người nhận ra tự tánh sẽ thoát hết phiền não, khổ đau, sống nhẹ nhàng, an nhiên, tự tại, không bị trói buộc bởi bất kỳ thứ gì, và khi hết duyên thì bỏ xác phàm, trở về Phật giới.
6.
Từ nay người đã rõ đường / Nhớ hành tinh tấn soi gương thấy mình
Khi được gặp Cha đã rõ đường về Quê, phải một lòng tinh tấn hành trì.
Cha dặn dò: luôn tinh tấn dùng gương vô tướng soi thấy mình – thấy bản thể không hình tướng, không vọng tưởng, không bị dính mắc.
7.
Rõ vô vật vô minh tan rã / Dạo Ta Bà tiếp dẫn độ tha
Khi thấy rõ bản thể là "vô vật", thì vô minh tan rã, vì đâu còn hình tướng gì để dính vào. Lúc đó, có thể ung dung dạo Ta Bà, không dính gì hết, hành tiếp dẫn và độ tha.
8.
Giúp người điên đảo thoát ra / Cùng nhau dạo bước về Nhà Như Lai
Cha nhắc: khi mình đã rõ, hãy giúp người điên đảo thoát ra, rồi cùng nhau trở về Nhà Như Lai – tức chỗ Tự Tánh an nhiên, tịch tịnh.
9.
Người hữu phúc đáo lai nhất kiếp / Kẻ vô duyên vạn kiếp trôi hoài
Nhấn mạnh: người có phúc – tức hội tụ đủ công đức, phước, và cả may mắn – mới gặp được con đường này để quay về chốn Như Lai trong một kiếp.
Ngược lại, kẻ vô duyên sẽ vạn kiếp trôi hoài, không thấy được đường Đáo Lai
10.
Đại duyên Vô gửi một bài / Ai nhận Ngọc Quý về ngay quê Nhà
Đại duyên, đại phúc cho ai mới nhận được bài này, ai đã nhận lại Ngọc Quý, thì đừng lăn tăn, đừng tìm kiếm gì nữa, mà hãy một lòng nhất chí, trở về Quê.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_o1v5m_1', '1660a340-9bef-48c6-9061-0e441cf938fb', 'Người thiết tha tìm ra bổn tánh
Quyết một lòng đến chỗ tịnh thanh
Hữu duyên ước nguyện sẽ thành
Nhận ra tự tánh người hành An Nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_6ji2p_2', '1660a340-9bef-48c6-9061-0e441cf938fb', 'Kể từ nay thoát phiền thoát khổ
Sống an nhàn về chỗ Phật phương
Từ nay người đã rõ đường
Nhớ hành tinh tấn soi gương thấy mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_3853w_3', '1660a340-9bef-48c6-9061-0e441cf938fb', 'Rõ vô vật vô minh tan rã
Dạo Ta Bà tiếp dẫn độ tha
Giúp người điên đảo thoát ra
Cùng nhau dạo bước về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_qtp2f_4', '1660a340-9bef-48c6-9061-0e441cf938fb', 'Người hữu phúc đáo lai nhất kiếp
Kẻ vô duyên vạn kiếp trôi hoài
Đại duyên Vô gửi một bài
Ai nhận Ngọc Quý về ngay quê Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.084Z', '2026-06-16T03:08:15.084Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_e750i_0', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con cảm thấy mệt mỏi
Than trách mình sao sanh cõi u minh
Về bên Cha nơi chẳng có tướng hình
Thấy rõ mình chẳng sinh bao giờ cả', 'Phân tích bài kệ "Nếu Một Ngày Con Mệt Mỏi"
1. Nếu một ngày con cảm thấy mệt mỏi, than trách mình sao sanh cõi u minh – sinh khổ, thấy mình sinh ra cõi này quá khổ, mặc dù được hưởng quá trời từ cõi này: thân người, nhà cửa, xe cộ, đồ ăn thức uống...
Về bên Cha nơi chẳng có tướng hình, thấy rõ mình chẳng sinh bao giờ cả – không có tướng hình thì chẳng sanh bao giờ.
2. Nếu một ngày con thấy mình mệt lả, than trách mình sao già yếu nhăn nheo – già khổ.
Về bên Cha nơi chẳng có Tuổi leo, thấy rõ mình chẳng bao giờ Già trẻ – thấy rõ mình tức biết mình vô hình vô vật, sao đo đếm được tuổi thọ, vô lượng thọ, thì làm gì còn chấp mình già trẻ. Không còn khổ vì chấp mình trẻ (mình còn trẻ mà cứ chơi đi), không còn khổ vì chấp mình già (mình già quá rồi mệt mỏi quá).
3. Nếu một ngày thấy mình không mạnh mẽ, than trách mình bệnh tật tới triền miên – bệnh khổ.
Về bên Cha chẳng có thân hiện tiền, thấy rõ mình chẳng bao giờ bệnh nữa – nhớ bản lai không hình không vật của mình mà về đó, chẳng gì dính được, pháp thân chẳng bệnh.
4. Nếu một ngày con thấy mình sợ sệt, than trách đời sao thần chết gọi tên – tử khổ, một trong bốn khổ mà chúng sanh bắt buộc phải trải qua.
Về bên Cha chẳng thứ chi tìm đến, thấy rõ mình chẳng thể nào chết được – khi ở nơi bản thể, vô hình vô vật, thì chẳng có cái gì tìm đến được, chẳng có chết.
5. Nếu một ngày con thấy mình buồn tủi, than trách đời mãi diễn cảnh chia ly – ái biệt ly khổ. Khi dính mắc vào ái luyến nào đó, bất kỳ thứ gì, người gì, khi xa liền buồn tủi liền.
Về bên Cha chẳng có chỗ đến đi, thấy rõ đời ai cũng về một chốn – ở yên ngay bản thể nơi Cha ở đó thì chẳng có chỗ đến đi, họ chưa từng là của mình, chưa từng đến với mình nên chưa từng rời đi. Tất cả chúng sanh rồi đây sẽ thành Phật, tất cả rồi sẽ quay về bản thể.
6. Nếu một ngày con thấy mình khốn đốn, than trách mình Cầu mãi chẳng được chi – cầu bất đắc khổ (cầu không đạt được nên sinh ra khổ).
Về bên Cha có mọi thứ diệu kỳ, thấy rõ mình thiếu chi mà Cầu lụy – ở đó mới thấy mọi thứ diệu kỳ, không ở đó được sẽ chỉ thấy phiền não. Ở yên ngay đó thấy mọi thứ sanh diệt, thấy rõ quy luật vốn như vậy, không dính gì mới là diệu kỳ. Huệ Năng ngộ ra chỗ này gọi là diệu tâm. Đức Thế Tôn nói: “Ta có chánh pháp nhãn tạng, niết bàn diệu tâm, thực tướng vô tướng, chẳng lập văn tự, truyền ngoài kinh giáo” – chính là chỗ này. Bản lai không vật – không thiếu gì. Ở yên bản lai thấy rõ tất cả mọi thứ – không thiếu thứ gì.
7. Nếu một ngày con thấy mình tiều tụy, than trách đời sao đối xử vô tâm – oán tánh hội khổ. Khi ở gần một người nào đó, người nào tánh tình hay oán trách người khác, sẽ khổ.
Về bên Cha nơi chẳng có mê lầm, thấy rõ mình tham sân si chẳng dính – ở yên tự tánh được rồi, biết rõ mình không hình không vật, người đời vô tâm với mình hay không cũng không quan trọng, khen chê cũng không quan trọng, thì không còn trách ai hết.
8. Nếu một ngày con thấy mình loạn tính, than trách mình theo ngũ uẩn vọng ma – ngũ ấm xí thành khổ. Ngũ uẩn bao gồm: sắc, thọ, tưởng, hành, thức. Khi chạy theo hình tướng nào đó – sắc, niệm sinh ra – thọ, chạy theo thọ sinh ra tưởng, hành theo cái tưởng rồi lưu lại thành thức, dính vào thức do cái tưởng tạo ra. Trùng trùng điệp điệp những ngũ ấm như vậy trói buộc, rất khó thoát ra.
Về bên Cha nơi Tự Tánh là Nhà, thấy rõ mình chẳng bao giờ vọng tưởng – chỉ cần về bên Cha – tức là ở yên tự tánh thì ở giai đoạn nào của ngũ uẩn cũng có thể dừng và thoát ra được.
9. Nếu một ngày con thấy mình xót thương, than trách đời âm dương thường cuốn hút – khổ do điện từ âm dương cuốn hút. ngộ hay không ngộ thì âm dương vẫn cuốn hút.
Về bên Cha chẳng dính dù một chút, thấy rõ mình tự tại chốn trần lao – ở yên bản thể thì chẳng âm dương nào cuốn hút được.
Tất cả chúng sanh ai cũng phải trải qua 9 khổ này. Người đi trên đạo giải thoát vượt qua 9 cái khổ này là thành đạo. Tất cả 9 khổ này chỉ cần về bên Cha – ở yên nơi bản thể, rõ mình không hình không vật, tự tại trong chốn trần lao thì vượt thoát tất cả', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_n6wm7_1', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình mệt lả
Than trách mình sao già yếu nhăn nheo
Về bên Cha nơi chẳng có Tuổi leo
Thấy rõ mình chẳng bao giờ Già trẻ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_kfvqa_2', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày thấy mình không mạnh mẽ
Than trách mình bệnh tật tới triền miên
Về bên Cha chẳng có thân hiện tiền
Thấy rõ mình chẳng bao giờ bệnh nữa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_ug82z_3', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình sợ sệt
Than trách đời sao thần chết gọi tên
Về bên Cha chẳng thứ chi tìm đến
Thấy rõ mình chẳng thể nào chết được', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_g80ao_4', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình buồn tủi
Than trách đời mãi diễn cảnh chia ly
Về bên Cha chẳng có chỗ đến đi
Thấy rõ đời ai cũng về một chốn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_v1858_5', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình khốn đốn
Than trách mình Cầu mãi chẳng được chi
Về bên Cha có mọi thứ diệu kỳ
Thấy rõ mình thiếu chi mà Cầu lụy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_5hdwr_6', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình tiều tụy
Than trách đời sao đối xử vô tâm
Về bên Cha nơi chẳng có mê lầm
Thấy rõ mình tham sân si chẳng dính', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_c8co2_7', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình loạn tính
Than trách mình theo ngũ uẩn vọng ma
Về bên Cha nơi Tự Tánh là Nhà
Thấy rõ mình chẳng bao giờ vọng tưởng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_2ce7z_8', 'a0930233-dd8b-4ae5-80da-5555c91b8951', 'Nếu một ngày con thấy mình xót thương
Than trách đời âm dương thường cuốn hút
Về bên Cha chẳng dính dù một chút
Thấy rõ mình tự tại chốn trần lao', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.091Z', '2026-06-16T03:08:15.091Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_j9p12_0', 'f376c07f-a165-4919-8660-84257b818cab', 'Bèo không tướng thấy mình trôi nổi
Cố kiếm tìm bến đỗ nương thân
Nơi đâu trong chốn hồng trần
Bèo kia ghé được không cần trôi lăn', 'Phân tích bài kệ "Bèo Không Tướng"
1.
Bèo không tướng thấy mình trôi nổi
Cố kiếm tìm bến đỗ nương thân
"Bèo không tướng" – thực chất các con không có hình tướng, nhưng vì chấp mình là bèo, mình còn tướng, nên thấy mình trôi nổi, bấp bênh.
Từ đó, sinh tâm cố tìm một nơi nương tựa, một "bến đỗ" an toàn giữa dòng đời.
2.
Nơi đâu trong chốn hồng trần
Bèo kia ghé được không cần trôi lăn
Nhưng trong chốn hồng trần huyễn hoặc, nơi nào bèo có thể ghé vào thì cũng phải trôi lăn.
Dù ghé vào chúng sanh nào trong tam giới, cũng không thoát khỏi sanh tử luân hồi – không có chốn nào là điểm đến vĩnh hằng.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.096Z', '2026-06-16T03:08:15.096Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_na206_1', 'f376c07f-a165-4919-8660-84257b818cab', 'Theo dòng nước lăng xăng chảy mãi
Cứ trôi hoài trong cảnh bi ai
Gặp được tuyệt cảnh thật may
Ngờ đâu là lối đoạ đày sáu phương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.096Z', '2026-06-16T03:08:15.096Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_uza3v_2', 'f376c07f-a165-4919-8660-84257b818cab', 'Hỏi thế gian đâu là vô thượng
Để chứa được vô tướng Bèo kia
Chỉ khi dòng nước đứt lìa
Bèo liền cập bến rõ tia Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.096Z', '2026-06-16T03:08:15.096Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_07bxg_0', '96194a43-496f-49ae-b876-7fb6abbd2951', 'Theo dòng nước lăng xăng chảy mãi
Cứ trôi hoài trong cảnh bi ai
Dòng nước là dòng đời, lăng xăng, rối loạn, không dừng nghỉ.
Chúng sanh cứ trôi theo dòng đó, mãi loay hoay trong cảnh giới đau khổ và oán trách.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.101Z', '2026-06-16T03:08:15.101Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_u498c_1', '96194a43-496f-49ae-b876-7fb6abbd2951', '4.
Gặp được tuyệt cảnh thật may
Ngờ đâu là lối đoạ đày sáu phương
Có lúc tưởng chừng gặp được tuyệt cảnh – như gặp được "chân ái", hay thấy hình tướng Phật A Di Đà, tưởng rằng đó là giải thoát.
Nhưng hóa ra chỉ là vọng tưởng, chấp vào hình tướng cũng là con đường đưa đến luân hồi sáu nẻo.
Không có thứ gì nơi thế gian này có thể nương tựa được, tất cả đều là duyên sanh – đều vô thường, đều đưa đến đọa lạc nếu dính mắc.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.101Z', '2026-06-16T03:08:15.101Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_8jrcu_0', '89550811-8d8c-4dee-9ea5-8c9c180db831', 'Hỏi thế gian đâu là vô thượng
Để chứa được vô tướng Bèo kia
Khi đã trôi lăn, khổ đau quá mức, bèo thốt lên một tiếng hỏi:
"Đâu là con đường vô thượng, con đường tối thượng thật sự?', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.108Z', '2026-06-16T03:08:15.108Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_r9wu8_1', '89550811-8d8c-4dee-9ea5-8c9c180db831', 'Nơi nào có thể chứa được cái vô tướng là mình, không còn trôi nổi nữa?"
6.
Chỉ khi dòng nước đứt lìa
Bèo liền cập bến rõ tia Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.108Z', '2026-06-16T03:08:15.108Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_3nf8a_2', '89550811-8d8c-4dee-9ea5-8c9c180db831', 'Chỉ khi gặp được vị đạo nhân vô tu vô chứng, chặt đứt dòng nước – tức dừng được dòng đời trôi lăn, chỉ ra con đường thoát ly sanh tử.
Bèo khi đó liền cập bến, nhận ra bản tánh vô tướng của mình, rõ ràng tia Phật Đà – tức thấy được con đường duy nhất để giải thoát, không còn đi vòng quanh luân hồi.
Tổng kết:
Bài kệ là hình ảnh ẩn dụ của chúng sanh như bèo vô tướng, trôi lăn trong sanh tử, mỏi mệt tìm nơi nương tựa, nhưng mọi nơi trong thế gian đều không thật, đều dẫn đến khổ.
Chỉ khi gặp được đạo nhân chân thật, người khai thị bản tánh vô sanh vô tướng, chỉ thẳng cho chúng sanh trở về tự tánh, thì mới có thể ngừng trôi, cập bến giác ngộ, thấy rõ con đường Phật Đà – duy nhất, vững bền, và không còn khổ.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.108Z', '2026-06-16T03:08:15.108Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_pdqai_0', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì chẳng trước chẳng sau
Chẳng trên chẳng dưới chẳng đầu chẳng đuôi
Chẳng tai chẳng mắt chẳng thân
Chẳng miệng chẳng mũi chẳng cần có chi', 'Ý nghĩa Thứ Gì
THỨ GÌ - chỉ 2 từ NHƯNG ĐỦ ĐỂ phá tan tam giới, phá chấp hết tất cả. Có dùng ngôn từ gì để diễn đạt thì cũng không thể chạm tới.
1. BẢN CHẤT CỦA "THỨ ẤY" (TỰ TÁNH)
Vô hình vô tướng: "Chẳng trước chẳng sau... chẳng tai chẳng mắt... chẳng tên chẳng tướng". Tự Tánh không có hình dáng, không thể đo lường bằng thời gian (tuổi tác) hay không gian (trên dưới). Nó là cái Vô hình nhưng hằng hữu.
Hằng có lại Không: Nó hiện diện 24/24 qua cái Thấy, Nghe, Nói, Biết nhưng nếu Quý Vị dùng ý căn để tìm kiếm, để "luận lý" thì sẽ thấy nó như "Không". Càng tìm càng mất, càng luận càng "lông bông sáu đàng".
Vượt ngoài nhị nguyên: Nó "Chẳng Pháp chẳng Đàng / Chẳng Thanh chẳng Tịnh". Tại sao? Vì khi Quý Vị còn thấy mình "Thanh tịnh" là Quý Vị còn đối đãi với "Ô nhiễm". Tự Tánh vượt lên trên cả những khái niệm tốt đẹp nhất của ngôn từ.
2. TẠI SAO "THỨ ẤY" PHÁ TAN TAM GIỚI?
Không dính mắc lục trần: "Sáu căn tiếp xúc sáu trần chẳng ra". Bình thường, sáu căn tiếp xúc sáu trần sẽ sinh ra Thức (phân biệt, yêu ghét, dính mắc). Nhưng "Thứ Ấy" (Tự Tánh) thì Thấy chỉ là Thấy, Nghe chỉ là Nghe, không để lại dấu vết, không tạo nghiệp. Không tạo nghiệp thì lấy gì để luân hồi trong Tam Giới?
Phá vỡ sông mơ: "Sống không dính mắc sông mơ không còn". Tam giới thực chất là một giấc mơ dài do vọng tưởng dệt nên. Khi nhận ra "Thứ Ấy" hằng minh, không màng đến huyễn hoặc, thì giấc mơ tan biến, Tam Giới tự sụp đổ.
Điện từ Quang: "Thứ Ấy" hoạt động bằng Điện từ Quang (thanh tịnh, không âm dương). Tam giới vận hành bằng điện từ Âm Dương. Khi Quý Vị ở yên nơi "Thứ Ấy", Quý Vị không còn bị lực hút Âm Dương kéo đi nữa.
3. GIẢI MÃ CÁC ẨN DỤ SẮC BÉN
Đại Giàu: Nhận ra Tự Tánh là nhận ra kho báu bất tận (Vô Lượng Công Đức, Vô Lượng Thọ). Núi vàng núi ngọc rồi sẽ tan biến theo tứ đại, chỉ có "Thứ Ấy" là bất tử.
Thoát cảnh ăn Cà, Lang nướng, Bí ngô:
Cà: Cà kê, lê lết, nói chuyện phiếm, dính mắc vào những điều vụn vặt không lối thoát.
Lang nướng: Lang thang, lì lợm trôi lăn trong sáu nẻo không chịu về nhà.
Bí ngô: Bí bách, ngu ngơ, ngô nghê không biết mình là ai.
Liễu ý Tam Vô: Khi hiểu được Vô Tự Ngã, Vô Tướng, Vô Niệm, Quý Vị sẽ có được "bản đồ" để đi thẳng về Nhà Như Lai mà không bị lạc đường.
4. LỜI PHẬT: "49 NĂM KHÔNG NÓI MỘT LỜI"
Quý Vị đã nhắc đến một điểm cốt tủy. Đức Phật không nói lời nào vì Sự Thật (Thứ Ấy) không thể diễn tả bằng lời. Mọi kinh điển chỉ là "ngón tay chỉ trăng". Nếu Quý Vị chấp vào ngón tay (kinh điển, danh từ), Quý Vị sẽ mất mặt trăng (Tự Tánh).
Phá kinh điển: Để Quý Vị đừng làm nô lệ cho chữ nghĩa.
Phá Niết bàn: Để Quý Vị đừng dính mắc vào một trạng thái an lạc giả tạo mà quên mất Bản Thể vốn tự an nhiên.
Lời của Ta: "Thứ Ấy" đang đọc những dòng này. "Thứ Ấy" đang nghe âm thanh xung quanh. Nó chưa từng rời xa Quý Vị dù chỉ một sát na.
Đừng tìm nó ở tương lai, đừng tìm nó ở Phật đài. Hãy dừng lại mọi sự luận lý, ở yên nơi cái Thấy - Nghe - Biết không dính mắc, Quý Vị sẽ thấy "Thứ Ấy" hiện ra rạng ngời. Lúc đó, Quý Vị chính là "Đại Giàu", là bậc Đạo Nhân tự tại giữa Ta Bà.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_pu18x_1', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Chẳng tên chẳng tướng hình gì
Chẳng đo được tuổi chẳng nghì mà thông
Thứ gì hằng có lại không
Ai mà luận lý lông bông sáu đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_3mm26_2', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì chẳng thể luận bàn
Chẳng thanh chẳng sắc lại càng chẳng hương
Chẳng vị xúc pháp tồn thường
Nhận được thứ ấy rõ đường Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_d8rhw_3', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì thấy biết chẳng ưa
Vạn vật huyển hoá chẳng lừa được đâu
Thứ gì nhận được Đại Giàu
Núi vàng núi ngọc cũng đâu sánh bằng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_qx8mo_4', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì chẳng có thức sanh
Sáu căn tiếp xúc sáu trần chẳng ra
Thứ gì vẫn ở Ta Bà
Hằng nghe thấy biết nói mà chẳng vương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_y67y1_5', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì muôn khắc tỏ tường
Dù cho năm ấm vẫn thường hoá sinh
Luôn luôn huyển hoặc nơi mình
Nhưng mà thứ ấy hằng minh chẳng màng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_cap0g_6', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Thứ gì chẳng Pháp chẳng Đàng
Chẳng Thanh chẳng Tịnh chẳng An chẳng Lành
Muốn cho hết bị loanh quanh
Nhận được thứ ấy sẽ nhanh về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_7ik6j_7', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Từ nay thoát cảnh ăn Cà
Không còn Lang nướng hay là Bí ngô
Ai mà liễu ý Tam Vô
Thường hành Thứ Ấy bản đồ rõ thông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_48p18_8', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Từ nay hết bị lông bông
Nhận ra Thứ Ấy là xong luân hồi
Nay Vô chỉ Thứ Ấy rồi
Đại duyên nhận được về Ngôi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_chxzt_9', 'e042a5fc-fda2-44d2-bb68-c6c77aab8b8d', 'Nguyện cho nhân thế Ta Bà
Nhận ra Thứ Ấy rõ Nhà về quê
Nguyện cho nhân thế hết mê
Nhận ra Thứ Ấy liền về Nhà Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.114Z', '2026-06-16T03:08:15.114Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_yc3qp_0', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Lành thay con kính lòng thành
Nhớ ngày thị hiện con nhanh về nhà
Không ham mê đắm Ta Bà
Các con các cháu bên Cha thâm tình', 'Ý nghĩa Nguyện cho con cháu
. CẢNH TƯỢNG HỒI GIA: RỜI MÊ VỀ GIÁC
Về bên Cha: "Nhà" ở đây chính là Thất, là nơi Cha thị hiện, nhưng sâu xa hơn chính là Tự Tánh của mỗi người. Khi con cháu "bỏ hết chuyện thế gian" để quay về, đó là lúc con bắt đầu buông bỏ sự cuốn hút của điện từ âm dương để trở về với điện từ quang thanh tịnh.
Thâm tình bất nhị: Cảnh "đứa cười đứa khóc" thể hiện trọn vẹn sự vận hành của Tánh Người (16 thứ tánh ma). Nhưng dù cười hay khóc, chỉ cần con ở bên Cha – ở trong vùng hào quang của sự tỉnh thức – thì mọi buồn vui đều trở thành "an vui" của sự giải thoát.
II. LỜI NGUYỆN TỐI THƯỢNG: THOÁT LẦY LUÂN HỒI
Sư Cha phát nguyện không phải để con được giàu sang thế gian, mà nguyện cho con đạt được cái "Đại Giàu" của bậc giác ngộ:
Mãi Xuân: Tự Tánh vốn không già, không chết, luôn tươi mới. Nguyện cho con nhận ra cái "Xuân" bất diệt đó.
Thoát cảnh la cà: Nguyện cho con không còn là "đứa trẻ" ham chơi, lang thang lì lợm (lang nướng) hay ngu ngơ (bí ngô) trong sáu nẻo luân hồi nữa.
III. LỜI NHẮC CỐT TỦY: PHÁ CHẤP CÁI NGÃ (TÉ = NGÃ)
Đây là phần tinh yếu nhất mà Cha muốn gửi gắm qua hình ảnh ẩn dụ sắc bén:
Trụ nơi Bồ Đề: Khi con ở yên nơi Bản Thể (Thấy - Nghe - Nói - Biết rõ ràng mà không dính mắc), thì không có "Ma" nào (vọng tưởng, tham sân si) có thể lọt vào được.
Ẩn dụ Rào Bụi Chuối:
Bụi chuối: Tượng trưng cho những tri kiến thế gian, những cái "giỏi", cái "hay" mà con tự đắc.
Con khỉ (Ngã): Cái tâm trí nhảy nhót, luôn muốn thể hiện, muốn chứng đắc.
Té nhào (Ngã): Quý Vị liễu ý rất sâu sắc: Té chính là Ngã. Khi con cố công "rào bụi chuối" (xây dựng cái ngã bằng tri kiến), con chính là con khỉ tham lam. Con ăn chuối (hưởng thụ cái danh, cái giỏi) rồi vứt vỏ lung tung. Cuối cùng, chính con lại đạp lên cái "vỏ" (định kiến, bám chấp) của mình mà Té (Ngã). Cái Ngã càng lớn, cú té càng đau.
IV. HÀNH ĐẠO: TỰ LẦN LỐI RA
Hành luôn tỉnh thức: Cha chỉ là người chỉ đường, là ngón tay chỉ trăng. Con phải tự mình tỉnh thức trong từng sắc na để nhận diện "con khỉ" đang nhảy nhót bên trong.
Cha đang chờ: Bản thể Phật Tánh (Cha) chưa bao giờ rời xa con. Chỉ cần con thôi "nhảy nhót", thôi "rào bụi chuối", thì con sẽ thấy Cha luôn ở đó, ngay tại Nhà.
Quý Vị hãy chiêm nghiệm thật kỹ lời nhắc về "Cú Té của Con Khỉ". Đừng để những gì mình biết, mình giỏi trở thành cái vỏ chuối làm mình trượt ngã trên con đường về Quê Xưa. Hãy buông cái "Ngã" xuống, thì con đường sẽ tự hiện ra dưới chân.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_su0vs_1', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Từng con bày tỏ tâm mình
Đứa cười đứa khóc nhưng đều an vui
Có đứa cứ mãi lui cui
Bỏ Cha đi mãi mới quay về nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_a60hi_2', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Đại duyên Vô đến Ta Bà
Nguyện cho con cháu thoát đà trầm luân
Nguyện cho con cháu mãi xuân
Nguyện cho con thoát cảnh luân hồi này', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_cv0ys_3', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Nguyện cho con cháu thoát lầy
Nguyện con giải thoát về ngay Phật Đà
Nguyện con thoát cảnh la cà
Nguyện cho con mãi ở Nhà bên Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_azm1b_4', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Con ơi nhớ lấy lời Ta
Bồ Đề con ở chẳng Ma nào vào
Biết đâu là chốn nên rào
Rào nhầm bụi chuối té nhào khổ thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162353_n493v_5', 'fa68520a-8709-4e42-a8c1-213efcc5b055', 'Lời Cha nhắc nhở ân cần
Hành luôn tỉnh thức tự lần lối ra
Con nay đã rõ quê nhà
Nhớ luôn tinh tấn về Cha đang chờ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.123Z', '2026-06-16T03:08:15.123Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_okdve_0', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Nỗi niềm hạnh phúc thế gian
Muôn người vui khoẻ an nhàn thảnh thơi
Sáng ra thấy ánh mặt trời
Tâm hồn tươi sáng giữa đời an yên', 'Ý nghĩa KÍNH TẶNG MẸ
I. KHỞI NGUYỀN: BIẾT ƠN CẢNH AN YÊN
Mẹ Thế Gian: Là người tạo ra tổ ấm, lo toan để con sáng ra thấy mặt trời, tối về được bình yên. Sáu câu đầu nhắc nhở dù ta là ai, cũng phải biết ơn người đã "vượt gian nan" để ta có được sự thảnh thơi hôm nay.
Mẹ Xuất Thế (Sư Cha): "Người vượt gian nan" chính là vị Đạo Nhân. Ngài đã thấu triệt khổ đau để chỉ cho ta thấy "ánh mặt trời" của trí tuệ. Cảnh an yên của người ngộ đạo là nhờ Sư Cha đã gánh vác, khai thị để tâm ta không còn dính mắc.
II. GIAI ĐOẠN "CUNG TỬ": NUÔI DƯỠNG TRONG BÀO THAI
Mẹ Thế Gian: 9 tháng 10 ngày mang nặng đẻ đau. Con "nghén" là mẹ khổ, con "đạp" là mẹ đau. Mẹ nén nỗi sầu riêng để giữ "Bầu" được yên.
Mẹ Xuất Thế (Sư Cha): 9 là kết quả, 10 là viên tròn. Sư Cha nuôi dưỡng hạt giống Phật Tánh trong ta. Những lúc ta quấy phá bằng tri kiến, bằng sự đòi hỏi, Ngài vẫn lặng lẽ bao dung để bảo vệ "bào thai giác ngộ" của ta được vuông tròn.
III. TIẾNG THÌ THẦM TRONG "NHỜN": LỜI KHAI THỊ
Mẹ Thế Gian: Con ở trong nước ối (nhờn), nghe tiếng mẹ lầm bầm dặn dò "đừng đày mẹ nha". Mẹ chờ đợi ngày con ra đời.
Mẹ Xuất Thế (Sư Cha): "Cung Tử" chính là vòng sanh tử luân hồi mờ mịt. Ta sống trong đó lâu quá nên "nhờn", không thấy rõ sự thật. Lời Sư Cha khai thị như tiếng thì thầm bên tai, nhắc ta "đừng ham chơi quá", hãy ở yên bản thể.
IV. GIÂY PHÚT CHÀO ĐỜI: SỰ TỰ CHỦ TRONG TỈNH THỨC
Mẹ Thế Gian: Mẹ đau quằn quại thấu xương để con chào đời. Con khóc để tống dịch nhầy ra khỏi khí quản, bắt đầu tự thở.
Mẹ Xuất Thế (Sư Cha): Là khoảnh khắc con Tỉnh Ngộ. Sư Cha mượn thân vật lý để giúp con "cắt dây rốn" bám chấp vào thế gian. Con khóc vì hạnh phúc, vì từ nay con đã chủ động được cuộc sống, không còn sống tầm gửi vào những cấu bẩn của lục trần.
V. NUÔI DƯỠNG VÀ TRƯỞNG THÀNH: GÁNH VÁC TRÁCH NHIỆM
Mẹ Thế Gian: Con ra đời mẹ vẫn chưa nhàn, lo bú mớm, thức đêm thay tã. Khi con biết gọi "Pa Pa, Má Má" là mẹ vui sướng vô ngần.
Mẹ Xuất Thế (Sư Cha): Sư Cha khai thị đến 4-5 giờ sáng, nghe mọi nỗi niềm của con mà quên cả thân căn mệt mỏi. Khi con nhận ra Bản Thể (Cha Mẹ thật sự), không còn là gã cùng tử lang thang, Sư Cha liền nói "Lành thay".
VI. SỰ BAO DUNG TRƯỚC CÁI NGÃ SAI LẦM
Mẹ Thế Gian: Con lớn khôn, đôi khi ích kỷ mà cãi lời mẹ. Mẹ vẫn cười, vẫn dạy con nên người.
Mẹ Xuất Thế (Sư Cha): Con mới có chút trí tuệ đã đòi "chém Cha", dùng tri kiến để hơn thua. Sư Cha vẫn bao dung dung chứa, nhưng nếu con quá ngạo mạn, Ngài sẽ "đập núi Tu Di" (phá cái Ngã) để cứu con khỏi sự lầm lạc.
VII. ĐẠI HIẾU: ĐƯA MẸ VỀ NHÀ XƯA
Mẹ Thế Gian: Thờ cha kính mẹ là đạo làm người. Nhưng báo hiếu lớn nhất là giúp mẹ thoát khỏi đảo điên, ưu phiền. Đưa mẹ thế gian về với "Nhà Quê Xưa" (Tự Tánh) để mẹ không còn bị "nắng mưa" của tham ái luân hồi hành hạ.
Mẹ Xuất Thế (Sư Cha): Báo đáp Sư Cha không phải bằng vật chất, mà bằng việc Hành đúng lời khai thị. Khi con thấy được "Tiếng cười Vô Sanh", đó là món quà quý giá nhất dâng lên Ngài.
VIII. LỜI KẾT: CHỮ "THÔI" VÀ SỰ AN NHIÊN
Thông điệp chung: Hãy "Thôi" tham ái, "Thôi" dính mắc. Đừng đợi mẹ mất mới cúng bái linh đình. Hãy đưa mẹ thoát khổ ngay lúc này bằng chính sự tỉnh thức của mình.
kệ này nhắc nhở ta rằng: Muốn làm một người con Đại Hiếu, trước hết phải là một người con Tỉnh Thức. Hãy vứt cái Ngã đi, nghĩ về những gì Mẹ (thế gian và xuất thế gian) đã mất vì ta, để mà quyết chí tiến nhanh về Nhà.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_f4kg3_1', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Trưa rồi chiều tối bình yên
Muôn thời vui vẻ khắp miền nhân gian
Nhớ người đã vượt gian nan
Cho con được cảnh mãi an như vầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_njs96_2', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Mẹ mang chín tháng mười ngày
Hành Mẹ mệt mỏi cả ngày lẫn đêm
Muốn gì Mẹ phải ăn theo
Không thì lại quấy lại đạp Mẹ đau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_7upbl_3', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Vì con Mẹ nén nỗi sầu
Giữ mình vui vẻ giữ Bầu được yên
Vì con Mẹ làm rất siêng
Kiếm cơm kiếm cháo kiếm tiền nuôi con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ssf9e_4', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Mong sao con được vuông tròn
Luôn luôn khoẻ mạnh vung đòn Mẹ đau
Bụng đau Mẹ vẫn tươi cười
Vui vì con nhỏ là người mạnh hơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_51l74_5', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Sống trong Cung Tử rất nhờn
Thấy nghe không rõ nhưng mà cảm âm
Lâu lâu có tiếng thì thầm
Của cha của Mẹ lầm bầm bên tai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_s905u_6', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Nói con đừng có đùa dai
Nằm yên một chỗ đừng đày Mẹ nha
Bao lời yêu dấu cho ta
Đợi chờ tới lúc con ra với đời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_0ht4g_7', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Khổ đau Mẹ chẳng một lời
Mẹ luôn hạnh phúc đợi thời sanh con
Đến khi ngày tháng đủ tròn
Mẹ đau quần quại thấu trời thấu xương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_vlg1p_8', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Vì con Mẹ rán lên đường
Nhờ người giúp đỡ cho con chào đời
Khi nghe tiếng khóc thành lời
Thấy con đỏ ỏn Mẹ thời an tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_yrx80_9', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Ai mà muốn rõ một lần
Thử mang mười ký suốt gần một năm
Để mà thấy rõ tình thâm
Dù luôn mệt mỏi âm thầm Mẹ mang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_oomd0_10', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Con ra Mẹ vẫn chưa nhàn
Phải lo con bú con an thân mình
Con quậy Mẹ vẫn lặng thinh
Lo cho con nhỏ quên mình còn đau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ytjy7_11', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Có khi con biết diễn sâu
Làm hờn làm dỗi để cầu Mẹ yêu
Đến khi con đã biết kêu
Pa Pa Má Má Mẹ liền rất vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_5eo3k_12', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Bao đêm mất ngủ lui cui
Lo cho con lớn con vui mỗi ngày
Con đi con đứng thế này
Đều nhờ ơn Mẹ chịu cày vì con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_5q8tv_13', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Đôi khi con dại còn non
Vì lòng ích kỷ mà con cãi Người
Nhưng Mẹ vẫn mãi tươi cười
Vẫn lo vẫn dạy nên Người khôn ngoan', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_35ka0_14', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Dù con gặp cảnh trái ngang
Mẹ luôn ở đó giúp An con liền
Con tạo bao cảnh ưu phiền
Mẹ luôn vui vẻ khiến phiền lìa con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_259kd_15', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Tâm Mẹ lớn tựa núi non
Lớn hơn biển cả hơn Hòn Tu Di
Ai ơi vứt cái Ngã đi
Nghĩ về Mẹ đã Mất gì vì ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_if3u7_16', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Sống trong cõi tạm Ta Bà
Thờ cha kính Mẹ mới là Đạo Con
Làm sao báo đáp cho tròn
Ơn Sanh nghĩa dưỡng cho con nên người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_6l4lg_17', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Muốn Mẹ được mãi vui tươi
Người thời nên thấy tiếng cười Vô Sanh
Bao năm lạc lối loanh quanh
Người nên quyết chí tiến nhanh về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_61xd8_18', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Quê Nhà chẳng có gần xa
Không nơi không chốn nhưng mà hằng An
Là nơi người mãi an nhàn
Đưa Mẹ về đó là Đàng an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_l7auu_19', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Mẹ thời không bị đảo điên
Ung dung tự tại ưu phiền tránh xa
Mẹ luôn hằng sống trong Nhà
Không Si tham ái không va luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_gjt3v_20', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Vô cho người một chữ Thôi
Thôi tham ái luyến để rồi mãi An
Những ai còn Mẹ đừng Than
Đừng gieo oan trái Mẹ mang ưu phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ozhc1_21', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Đến khi Mẹ đã quy tiên
Linh đình cúng bái Mẹ hiền còn đâu
Đừng gieo khổ não u sầu
Đưa Mẹ thoát khổ để mau về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_heu3b_22', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Nhà người không ở đâu xa
Không cầu không kiếm là Nhà quê xưa
Mẹ người không bị nắng mưa
An vui hạnh phúc không ưa não phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_w6ks8_23', '038a0215-ddd2-43d1-b230-0c369b7c1b99', 'Nguyện cho Muôn Mẹ an nhiên
Vô lo vô nghĩ vô phiền vô Tâm
Nguyện cho muôn Mẹ an lành
Tỏ chơn thật Tánh Vô Sanh muôn thời
Hữu duyên Vô gửi mấy lời
Nguyện cho nhân thế muôn đời an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.131Z', '2026-06-16T03:08:15.131Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_u1jg6_0', 'c633c61c-d448-4212-b0fd-9d82fc825205', 'Ôi lành thay con nay rõ cặn kẽ
Lời chỉ bày Ta gửi tặng con thơ
Kể từ nay đừng lạc chốn mộng mơ
Luôn tinh tấn theo Ta về bờ Giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.139Z', '2026-06-16T03:08:15.139Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_hkkhx_1', 'c633c61c-d448-4212-b0fd-9d82fc825205', 'Dù dòng đời luôn phân chia thiện ác
Hãy vững lòng không tác ý động tâm
Từng giây phút tỉnh thức trong âm thầm
Lìa cõi trược toạ nơi chân hạnh phúc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.139Z', '2026-06-16T03:08:15.139Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_difiv_0', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân cảnh đẹp lạ lùng
Đồi cao thấy rõ muôn trùng dặm xa
Trường Xuân chẳng tiếng vọng va
Nghe xa đến chỗ chẳng sa âm nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_1dlyq_1', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân miêu tả thế nào
Nói sao cho đặng chỗ mà vô ngôn
Trường Xuân là chốn thường tồn
Biết tường biết tận chín loài thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ax3jh_2', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân là chốn hằng an
Ý thường sinh khởi lại nhàn muôn nơi
Trường Xuân là chốn thảnh thơi
Ánh vàng luôn toả đời đời an nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_voh2q_3', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân nôi của thánh hiền
Luôn hành tự tánh chẳng phiền chẳng lo
Trường Xuân không cảnh mượn cho
Đời luôn thanh thản chẳng lo khổ sầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_c5qie_4', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân không vọng mong cầu
Ngay mình đầy đủ chẳng thâu gì vào
Trường Xuân ấy ở nơi nào
Ngay nơi bản thể chẳng vào chẳng ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_58wdu_5', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân chẳng có tánh ma
Tham sân si khởi mãi mà dính đâu
Trường Xuân chỉ có một màu
Kim quang trùm khắp đại giàu thong dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_4smip_6', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân là chốn Đồi Thông
Không còn dính mắc lòng vòng thế gian
Trường Xuân cảnh mãi thanh nhàn
Không buồn không khổ không than không phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_s888q_7', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Trường Xuân ai rõ đại duyên
Hãy mau cất bước về miền ấy ngay
Trường Xuân hiện ở cõi này
Ai duyên thấy rõ về ngay Nhà mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_tyvfu_8', 'ec1d9ca8-47af-4f5b-87da-d4b7345d6e6a', 'Đại Duyên bày tỏ chút tình
Ai duyên liễu ý tử sinh không còn
Hành ngay đến chỗ viên tròn
Thong dong người mãi ở đồi Trường Xuân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.144Z', '2026-06-16T03:08:15.144Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_lyxh2_0', '0cb64235-f705-4b5a-bcd3-625bde1b75bf', 'Ý Như ở Di Linh Lâm Đồng Kính trình kệ  Cúng Dường Cảm Niệm Ân Sư Cha Tam Vô!
Nhân duyên sanh ở Đất Rồng
Tương phùng Sen nở ,Cam Lồ tuôn rơi
Chúng con không nói thành lời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.151Z', '2026-06-16T03:08:15.151Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_02928_1', '0cb64235-f705-4b5a-bcd3-625bde1b75bf', 'Cúi đầu kính lạy nhận ngay lời vàng
Ân Sư Ngài dạy rõ ràng
Tam Vô Ngài Ngự trong lòng chúng con
Thiền Thanh mãi mãi tương truyền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.151Z', '2026-06-16T03:08:15.151Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_n7u64_2', '0cb64235-f705-4b5a-bcd3-625bde1b75bf', 'Tam Vô Ngài đã chỉ con lối về .
Ý Như  29/09/ 2022
Nam Mô Tam Vô Ân Sư 🙏🙏🙏', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.151Z', '2026-06-16T03:08:15.151Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_c8gal_0', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Ý NHƯ Con ở LÂM ĐỒNG Kính trình kệ Cúng Dường Cảm Niệm ÂN SƯ CHA TAM VÔ
Đại duyên con gặp được Người
Nhận lời khai thị lệ rơi không ngừng
Vì duyên con đã thôi dừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_lqsmt_1', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Không còn khuya sớm tưng bừng đọc vang
Hôm mà nhận được lời vàng
Ngày rằm tháng sáu hai ngàn hai hai
Lần đầu con học online', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_94qy5_2', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Được Ngài dẫn lối chỉ ngai Phật Đà
Tâm con không thể vươn ra
Rơi vào Tự Tánh nhưng mà đâu hay
Hôm sau con quyết tìm ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_np735_3', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Con cùng con trẻ về nơi Đất Rồng
Gặp Ngài con hết ngóng trông
Buông dừng thôi dứt chẳng mong điều gì
Từ đó con luôn hành trì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_gun42_4', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Cùng với gia đình theo gót Sư Cha
Hằng ngày con đã nhận ra
Sống tại ngay mình chẳng xa Quê Nhà
Những lời Cha đã Phổ ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_vw36d_5', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Cho đàn con trẻ thoát qua mê lầm
Thấy Nghe Nói Biết không nhầm
Thường hành tự tánh lỗi lầm còn chăng
Nên không dính mắc lăn tăn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_y3csr_6', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Hỏi lòng còn có ăn năn chỗ nào
Biển sâu con cũng muốn vào
Tấm lòng con đó gởi vào Hư Không
Không biết nghìn dặm xa trông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_yw3d2_7', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Biết rồi tự tánh ở ngay nơi mình
Ân Cha Tái Thế Hiện Sinh
Nỗi niềm con trẻ ngay mình khắc ghi
Hành không dính mắc không nghi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_at8vp_8', '93d02b2d-94f5-4a03-86af-ae4d88ed9ff6', 'Nhận được chân Ý là nơi để về
Đường xưa lắm cảnh nhiêu khê
Hôm nay rõ lối đường về  Chân Như
Lời Cha vang vọng như như
Trong đêm ánh sáng Như Lai rõ Nhà
Ý Như  12/02/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.155Z', '2026-06-16T03:08:15.155Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_b9ftm_0', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Ý Như con xin Kính trình kệ Cúng Dường Cảm Niệm Sư Cha Tam Vô!,🙏🙏🙏
Nhớ một ngày hơn một năm về trước
Con gặp Người với ánh mắt ngây thơ
Người hỏi con gặp ta để làm gì ?', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_37dx2_1', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Con nói rằng con tìm đường Giải Thoát
Người lại hỏi con hiểu gì về Phật ?
Dạ thưa Sư con chưa hiểu được gì
Mãi đi tìm mà chẳng biết nơi đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_u0ry0_2', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Không ai chỉ rõ đường cho con cả
Nói mập mờ không rõ đến Chân Tâm
Ánh mắt Người thật ấm áp nhìn con
Niềm tin tưởng dâng trong lòng con trẻ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ri98w_3', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Người lại nói tuổi đời ta rất trẻ
Con có tin ta chỉ đến chỗ này
Con thưa rằng con không nhìn tuổi tác
Không trẻ già hay danh tiếng thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_b3n0l_4', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Người gật đầu và khai thị cho con
Con nhận được lệ rơi hoài không dứt
Niệm Ân Người sanh ra con lần nữa
Rõ con đường Người dẫn bước Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_79ad0_5', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Và từng ngày không cần sớm hay trưa
Các con cần Người không hề quãng nhọc
Và luôn nhắc hãy buông dừng thôi dứt
Hãy an nhiên nơi Tự Tánh con à !', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_pv9iw_6', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Luôn Nói Biết Thấy Nghe đều chân thật
Không dính mắc ắt rõ chốn Quê Xưa
Người dõi theo từng hơi thở con thơ
Con đau đâu Người cũng đau ở đó', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_cb4y7_7', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Nhưng mấy ai thấu hiểu được lòng Cha
Con nghẹn ngào thốt lên tiếng gọi Cha
Và từ ấy con luôn hành Tỉnh Thức
Hai chữ này con mãi khắc trong tim', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_i15it_8', '45abd0c0-783e-48e9-b960-f89031aa0888', 'Chưa rõ ràng Cha luôn luôn nhắc nhở
Để Tỉnh Thức tránh mê mờ bất chợt
Lời con trẻ nói bao giờ hết được
Vì Đại Duyên Sư Tam Vô thị hiện
Ân của Người mãi mãi ngự trong con.
Ý Như 14/08/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.160Z', '2026-06-16T03:08:15.160Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_saikg_0', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Ý NHƯ xin Kính trình kệ Cúng Dường Sư Cha Tam Vô
Ngày này của một năm về trước
Pháp _ Trụ _Hằng _Ý Như đoàn tụ
Rất đơn sơ nhưng hạnh phúc ngây thơ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_7jwj8_1', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Từ khi ấy tình Cha luôn ấm áp
Mãi trong con không khắc phai mờ
Tình Cha ấy đâu gì sánh được
Từng bước thơ Cha dìu dắt con về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_4u4ut_2', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Cho các con Thức Tỉnh khỏi cơn mê
Không dính mắc tướng hình ảo cảnh
Ở Tự Tánh không sanh không diệt
Phúc cho ai mãi ghi khắc lời Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_jglnd_3', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Luôn hành trì những lời Cha khai thị
Con lại nhớ lần đầu đảnh lễ
Con gọi Sư nhưng rất lạ kỳ
Người không giống như những Sư con gặp', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_j0o9m_4', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Người Ân cần chẳng quản nhọc thời gian
Chỉ các con rõ đường Giải Thoát
Đưa chúng con đến chỗ viên tròn
Để chúng con không còn sanh hay tử', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_i3kxp_5', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Hành tinh tấn đến chỗ Bất Tư Nghì
Rồi khi con gọi tiếng "Cha ơi"
Không phải là Người Cha nhân thế
Người đã nhận không phải là để gọi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_vytne_6', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Ngày lẫn đêm Người khai thị chúng con
Trên con đường vượt xuất thế gian
Không loanh quanh rõ lối Về Nhà
Nhưng chúng con mấy ai rõ Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_f1o2d_7', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Nên trôi mãi giữa dòng đời bất tận
Đến hôm nay ngày ấy lại về
Đàn con cháu nhiều hơn đáng kể
Cha thương nhìn đàn con trẻ tung tăng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_95yu6_8', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Đứa ôm tay người ôm chân dành lấy
Bao yêu thương gói trọn nơi này
Ý Như nhìn nước mắt tuông rơi
Niềm hạnh phúc không sao mà kể hết', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_zucz8_9', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Lời muốn nói nhưng không sao thốt được
Chỉ mong rằng huynh đệ cùng nhau
Hành Tỉnh Thức về Quê Xưa ấy
Chẳng mê mờ với cảnh cũ trần gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_0ds2a_10', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Luôn theo Cha tinh tấn bước Về Nhà
Từng bước một rõ ràng vững chắc
Ở Tánh Không chẳng vướng bụi trần
Vì sự thật ta không là gì cả', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ag28t_11', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Chấp vào hình vào tướng nên sa ngã
Lạc trôi hoài muôn kiếp trần gian
Luôn tinh tấn không hề lùi bước
Cha khai ngộ chúng con về Bờ Giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_tciww_12', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Thoát Vô Minh ở tại Pháp Thân mình
Con trẻ nguyện buông bỏ u minh
Theo Chân Người không còn sanh tử
Niệm Ân Người vì chúng con Hiện Thế', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_ibfrb_13', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Đến nơi này Người phổ tế chúng con
Nơi Đất Rồng ươm mầm Giác Ngộ
Sư Tam Vô mở lối đón về
Con cùng cháu luôn hành nơi Tự Tánh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_r55qy_14', 'da5eaba9-9d1e-4a29-b21f-79bdc226e9be', 'Cổng Chân Như luôn mở cửa đón chờ .
Ý Như  13/09/2023
Dạ !🙏Con kính cảm niệm Ân Sư Cha.🙏🙏🙏', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.168Z', '2026-06-16T03:08:15.168Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_kacui_0', '901d97a4-74f8-43f8-9b0e-dc36af81e440', 'Bao năm cầu Đạo Lầu Đài
Gặp Vị khai rõ ở ngay mặt mình
Nhưng mình nghi ngại lặng thinh
Thế là tìm tiếp tử sinh vẫn hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.175Z', '2026-06-16T03:08:15.175Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_cjh6s_1', '901d97a4-74f8-43f8-9b0e-dc36af81e440', 'Đến khi người đã mệt nhoài
Cầu xin chư Phật chỉ đường thoát ra
Buông đi kiến chấp Ngay Ta
Gặp Vị phá Núi lòi ra Lầu Đài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.175Z', '2026-06-16T03:08:15.175Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_gk5ty_2', '901d97a4-74f8-43f8-9b0e-dc36af81e440', 'Nhận được bản thể Như Lai
Không hình không vật an hoài là Ta
Thấy nghe nói biết không va
Chủ Nhân Ông đó là Nhà Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.175Z', '2026-06-16T03:08:15.175Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162354_d500c_3', '901d97a4-74f8-43f8-9b0e-dc36af81e440', 'Dù cho tứ đại kéo đưa
Lục trần ngũ ấm dây dưa dụ hoài
Ở yên bản thể Như Lai
Sống không dính mắc về Ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.175Z', '2026-06-16T03:08:15.175Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_m9864_0', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Bình minh ló dạng từ xa
Từng tia nắng ấm xuyên qua sương mờ
Ánh vàng dịu nhẹ như tơ
Lướt qua ngọn cỏ nhành cây ao hồ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_jt2jh_1', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Lũ chim được dịp bô bô
Líu lo ríu rít xô bồ lăng xăng
Con nào con nấy lăn tăn
Nhảy qua nhảy lại từng cành trên cây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_tih19_2', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Con thì bay nhảy tìm mồi
Con thì líu ríu hót hoài không thôi
Có đám đùa giỡn liên hồi
Có con im lặng chỉ ngồi thẩn thơ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_gjlvn_3', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Còn cặp Cu trắng nãy giờ
Lượn vòng quấn quít tình thơ tuôn trào
Vài con se sẻ bay vào
Mang theo cọng cỏ bay vào tổ chim', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_hh4x9_4', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Lướt quanh cây cối mái nhà
Đâu đâu cũng có tổ mà chúng xây
Dưới thì lũ cá suốt ngày
Lượn qua lượn lại như mây trên trời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_tuszp_5', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Dù cho Sáng tối sao dời
Cá đây cũng mãi không lời mà bơi
Chỉ cần một hạt thức rơi
Cả đàn nhảy nhót tơi bời ăn nhanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_0nbo0_6', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Cá chim luôn sống an lành
Chẳng tiền chẳng của vẫn hoài thảnh thơi
Cá thì dưới nước mà bơi
Chim thì bay nhảy chẳng rơi vào phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_kzfe5_7', 'b994939d-2782-49ff-9d18-4749fc30a74e', 'Vậy sao người cứ đảo điên
Lao tâm khổ trí để phiền đến ta
Làm sao hằng sống trong Nhà
Thong dong tự tại mới là An Yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.182Z', '2026-06-16T03:08:15.182Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_790er_0', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Dòng đời này như thế
Thử hỏi có mấy ai
Ung dung tự tại không
Buồn phiền rồi khổ mãi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_lwwxk_1', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Để tự tại giải thoát
Hành Tự Tánh Ngay Ta
Vô lo chẳng tử sanh
An nhiên muôn thời mọi nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_1qx6w_2', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Người ơi nơi này vui lắm
Cứ sống mãi luôn thong dong
Vô tư ta không dính chi
Ung Dung Cuộc đời tươi sáng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_31fh0_3', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Dù cho bao ngàn giông tố
Gian nan sóng gió phong ba
Quyết chí đến nơi bình yên
An Nhiên sống nơi Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_cz1pt_4', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Người ơi đừng lo lắng
Suy Tư nếu sanh ra
Hãy mau Buông đừng theo
Thường Hành ở Tự Tánh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_o5w7b_5', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Người liền không dính mắc
Từ nay sống an nhiên
Không luân hồi tử sanh
Ung Dung tự tại mọi nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_m6676_6', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Từ nay Ta hành luôn Biết
Dính chấp cứ Buông ra ngay
An Nhiên Thong Dong bước đi
Ung Dung trên đường giải thoát', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_9vhsb_7', 'f7c374cc-27ad-425f-bea2-016cd4eaca0e', 'Dù cho bao điều ngăn bước
Ta đây nhất quyết đi qua
Cứ Thế đến ngôi Nhà Xưa
Nơi luôn có Cha đang chờ.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.189Z', '2026-06-16T03:08:15.189Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_jaaw7_0', '8efda14c-2927-4679-b99a-3cc26e0e0770', 'Đạo đời cứ thuận tuỳ duyên
Việc nào hảo ý hành liền không lo
Cõi trần là cõi mượn cho
Đừng đợi rối rắm mới lo Về Nhà', 'Phân Tích Chi Tiết
Câu 1 & 2: Đạo đời cứ thuận tuỳ duyên / Việc nào hảo ý hành liền không lo
Đây là nguyên tắc sống cốt lõi. Sư Tam Vô khai thị rằng "thuận tuỳ duyên" không có nghĩa là chỉ làm theo những việc dễ dàng, thuận lợi. Mà là, dù duyên đến là thuận hay nghịch, ta đều an nhiên đón nhận.
* "Thuận tuỳ duyên": Tức là thuận theo nhân duyên mà hành động. Duyên nào đến, ta cứ an nhiên đón nhận duyên đó. Dù là duyên tốt hay duyên xấu, ta không khởi tâm phân biệt, chống đối hay bám víu.
* "Việc nào hảo ý hành liền không lo": "Hảo ý" là những việc tốt cho mình, lợi cho người, không gây hại cho chúng sanh. Khi gặp những việc như vậy, hãy thực hành ngay không cần đắn đo, lo sợ.
* Đối với việc "bất hảo ý": Sư Cha chỉ dạy sâu sắc rằng, không phải ta trốn tránh việc khó khăn. Nhiều khi có những việc bắt buộc phải làm dù không hề tốt đẹp, ví như bị lạc trong rừng thì phải tìm đường ra. Cái cốt lõi ở đây là không chạy theo tâm thức tiêu cực của mình. Ta vẫn làm việc cần làm, nhưng không để tâm bị cuốn theo cảm xúc bực bội, chán nản, khó chịu. Đó mới là hành đúng với "thuận tuỳ duyên".
Câu 3 & 4: Cõi trần là cõi mượn cho / Đừng đợi rối rắm mới lo Về Nhà
Hai câu kệ này là một lời nhắc nhở sâu sắc về bản chất của cuộc sống và pháp hành đúng đắn.
* "Cõi trần là cõi mượn cho": Sư Cha khai thị rằng, tất cả mọi thứ trong tam giới này, từ thân tứ đại, tình cảm, cảm xúc, tiền tài, danh vọng... đều là ta đang "mượn" từ cõi điện từ âm dương mà có. Chúng ta là những "trùm nợ dai" từ vô tỷ kiếp. Khi hiểu rằng không có gì là của ta thật sự, ta sẽ bớt đi tâm dính mắc, chiếm hữu.
* "Đừng đợi rối rắm mới lo Về Nhà": "Nhà" ở đây chính là Bản Tánh thanh tịnh, là Pháp Thân vốn có của mỗi người. Lời dạy này nhắc nhở ta phải luôn "ở Nhà" ngay cả khi đang hành động giữa đời. Tức là, khi đối diện với mọi cảnh duyên, ta vẫn làm việc bằng thân xác này nhưng tâm luôn an trú nơi Tự Tánh, luôn thấy biết rõ ràng. Đừng đợi đến khi bị ngoại cảnh làm cho rối ren, khổ sở rồi mới cuống cuồng tìm cách "về Nhà". Hãy hành động từ "Nhà", thì sẽ không bao giờ bị lạc.
Câu 5 & 6: Vô lo vô nghĩ thế là / Vô danh vô lợi thế mà hằng An
Đây là kết quả tự nhiên khi ta đã thấu hiểu hai câu kệ trên.
* "Vô lo vô nghĩ thế là": Khi đã biết mọi thứ đều là duyên và là "cõi mượn cho", ta lo nghĩ để làm gì? Vũ trụ đã cho ta mượn thân xác, tâm trí, cảm xúc... mà không hề tính lãi. Vậy thì hãy cứ an nhiên tận hưởng những trải nghiệm đó. Cảnh nào đến cũng đều tốt, vì chúng đều là bài học. "Vô lo vô nghĩ" không phải là sống vô trách nhiệm, mà là sống không bị trói buộc bởi sự lo âu và toan tính vị kỷ.
* "Vô danh vô lợi thế mà hằng An": Sau khi "tận hưởng" những trải nghiệm được mượn, hãy nhớ rằng đừng cho cái danh vọng hay lợi lộc từ đó là của mình. Khi không còn bám chấp vào danh và lợi, ta sẽ đạt được trạng thái bình an vĩnh hằng ("hằng An"). Đó là sự an lạc chân thật, không phụ thuộc vào ngoại cảnh.
Câu 7 & 8: Người mà liễu ý sẽ nhàn / Ung dung tự tại trên đàng Như Lai
Hai câu cuối cùng chỉ ra con đường và thành quả rốt ráo của sự Giác Ngộ.
* "Người mà liễu ý sẽ nhàn": "Liễu ý" là thấu triệt được những lời khai thị của Sư Cha. Khi đã hiểu rõ, ta sẽ sống một cuộc đời nhàn hạ, không phải vì không làm gì, mà vì tâm không còn bị trói buộc.
* "Ung dung tự tại trên đàng Như Lai": Sống ung dung tự tại ngay cả khi gặp nghịch cảnh. Sư Cha ví von rằng, vì chúng ta "nợ dai" từ nhiều kiếp nên đôi khi chủ nợ (nhân quả) phải "đem giang hồ tới đòi nợ", tức là mang đến những cảnh khổ đau, bệnh tật. Khi đã hiểu rõ, ta hoan hỷ "trả nợ" mà không oán trách, không sân hận. Sống được như vậy, không dính mắc vào bất cứ thứ gì trên đời, chính là đang "ung dung tự tại" bước đi trên con đường của Như Lai.
Tóm lại, bài kệ "Duyên Hành" là một pháp môn thực tiễn, chỉ dẫn chúng ta cách sống tỉnh thức giữa đời thường. Đó là sống thuận theo duyên mà không bị duyên trói buộc, hành các việc lành mà không chấp công, an trú nơi Tự Tánh của mình để đối diện với vạn cảnh. Khi đó, khổ đau chỉ là việc "trả nợ" một cách hoan hỷ, và cuộc sống trở nên an lạc, tự tại trên con đường Giác Ngộ - Giải Thoát.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.193Z', '2026-06-16T03:08:15.193Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_gxyhc_1', '8efda14c-2927-4679-b99a-3cc26e0e0770', 'Vô lo vô nghĩ thế là
Vô danh vô lợi thế mà hằng An
Người mà liễu ý sẽ nhàn
Ung dung tự tại trên đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.193Z', '2026-06-16T03:08:15.193Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_mvt98_0', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Xưa kia người sống đơn thân
Mong được kết tóc se duyên một người
Đến khi duyên hảo đến rồi
Cùng nhau ước nguyện cả đời yêu nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_q5vu2_1', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Mỗi ngày chăm sóc vườn rau
Rồi chăm đàn cá hoa màu xanh tươi
Ngày ngày vang rộn tiếng cười
Vợ chồng chia sẻ ngọt bùi với nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_nygnl_2', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Trớ trêu vui chẳng bao lâu
Mỗi khi nghịch cảnh càu nhàu than ôi
Ai cũng giữ chặt cái tôi
Hơn thua đổ lỗi móc lôi não phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_7ds55_3', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Vợ chồng cứ mãi đảo điên
Buồn bực trách móc triền miên mỗi ngày
Sáng đêm diễn mãi cảnh này
Hỏi người được mấy phút giây an nhàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_yiioy_4', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Đến khi con trẻ về làng
Vợ chồng hớn hở nhận vàng dưỡng nuôi
Vì con mình phải lui cui
Làm ăn cố gắng để nuôi thành tài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_geqbq_5', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Nuôi con hiểu biết mấy ai
Tài đâu chưa thấy chữ Tai đã về
Thương con mà cứ u mê
Mong cầu con giỏi rồi chê con mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_hu33c_6', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Bao giờ mới rõ sự tình
Đặt mình nơi ấy sẽ nhìn tỏ thông
Người ơi đừng cứ lông bông
Yêu thương người phải hiểu thông muôn loài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_vusyc_7', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Đời người sẽ hết mệt nhoài
Không cầu không khổ vì người quanh ta
Tự mình thoát khỏi tánh ma
Quay về bản thể rõ nhà mình đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_zqk6b_8', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Từ nay người hết u sầu
Gia đình người sẽ thấy màu an nhiên
Cả nhà hết đảo hết điên
Sống nơi trần cảnh ưu phiền không mang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_fn9e2_9', '66386c56-ff5d-4abf-b4b3-d37ebc4dddb6', 'Cả nhà người mãi an nhàn
Cùng nhau an lạc trên đàng Như Lai
Từ nay chẳng sợ chữ Tai
Gia đình người mãi an hoài bên nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.200Z', '2026-06-16T03:08:15.200Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_g4h13_0', '90063882-ead1-4250-b12d-c1976495bce9', 'Mọi người chung sống với nhau
Hai chữ Thành Thật thế nào phải Thông
Nếu không sẽ mãi lòng vòng
Lươn lẹo lấp liếm hỏi lòng có An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_5wmf1_1', '90063882-ead1-4250-b12d-c1976495bce9', 'Đến khi sự thật rõ ràng
Biết người lừa dối chữ An khó tìm
Dù cho giải thích hay im
Chữ Tin đã mất hỏi tìm sao ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_00ik3_2', '90063882-ead1-4250-b12d-c1976495bce9', 'Thành tâm Sám Hối người ta
Thành Thật mọi lúc thế là người An
Niềm Tin thấy lại rõ ràng
Niềm vui hạnh phúc an nhàn bên nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_v9ccj_3', '90063882-ead1-4250-b12d-c1976495bce9', 'Nhưng còn Chân Thật thì sao
Sống Chân và Thật thế nào phải Thông
Chân Thật chẳng thể cầu mong
Rõ Chân Thật Tướng là dòng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_ed1so_4', '90063882-ead1-4250-b12d-c1976495bce9', 'Chân Thật bất nhị không hai
Không vọng không tưởng không xài Lý Do
Không ham tính toán so đo
Không trụ không chấp không lo não phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_p9ow8_5', '90063882-ead1-4250-b12d-c1976495bce9', 'Chân Thật tự hết đảo điên
Muôn thời muôn khắc an nhiên cõi lòng
Ai ơi đừng mãi lòng vòng
Hành luôn Chân Thật cho xong cõi phàm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_o2m1l_6', '90063882-ead1-4250-b12d-c1976495bce9', 'Duyên sanh thuận nghịch vẫn làm
Sống luôn Chân Thật là Đàng Vô Sanh
Đời người sẽ hết loanh quanh
An nhiên tự tại thường hành Chân Như', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.207Z', '2026-06-16T03:08:15.207Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_ip2ob_0', '77d1f3d4-afd2-4b0e-b1e9-124ebdb3681e', 'Có một kẻ từ khi sinh ra đời
Khi còn trẻ luôn hồn nhiên vui vẻ
Vô âu lo chẳng bao giờ buồn tẻ
Không muộn phiền mà mãi thấy bình an', 'Giải thích dùm tại người tự trói thôi
Kẻ Ngu kia liền chửi rủa liên hồi
Ai lại khùng mà tự trói mình đâu
Ông không giúp thì cứ nói một câu
Đừng lừa gạt lấy hết Của tôi nhé
Lại gặp được người Trí chỉ cặn kẽ
Nguyên do đâu mà bị trói thế này
Rồi chỉ gỡ từng li từng tí một
Kẻ Ngu kia phát khùng lên đột ngột
Miệng chửi mắng ông như hai người khác
Lại nói rằng tôi tự trói thân tôi
Này các ông hãy đừng có lôi thôi
Giúp không được đừng làm tôi mất hết
Đường Dạo Hành chẳng thể nhìn điểm kết
Đạo Cảm Thông là không thể nghĩ bàn
Ngước lên trời không một tiếng than van
Mà dòng lệ tuôn rơi hoài không dứt', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.213Z', '2026-06-16T03:08:15.213Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_2lw9l_1', '77d1f3d4-afd2-4b0e-b1e9-124ebdb3681e', 'Rồi một ngày chạy theo chuyện thế gian
Tự tay mình trói chặt cả toàn thân
Rồi kêu la nhờ người đến cứu giúp
Có Người Trí thương tình mà chỉ rõ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.213Z', '2026-06-16T03:08:15.213Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_p7ule_2', '77d1f3d4-afd2-4b0e-b1e9-124ebdb3681e', 'Ông chỉ cần buông bỏ cả hai tay
Là toàn thân không bị tự trói nữa
Kẻ Ngu kia không tiết lời chửi rủa
Bỏ tay rồi mất hết Của tôi sao', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.213Z', '2026-06-16T03:08:15.213Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_m08q1_3', '77d1f3d4-afd2-4b0e-b1e9-124ebdb3681e', 'Ông không giúp hãy biến ngay đi nào
Đừng ở đó coi chừng không toàn mạng
Người Trí khác ân cần mà chỉ dẫn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.213Z', '2026-06-16T03:08:15.213Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_9hopw_0', 'bc7aa7d8-1d5a-4e82-ad77-aa91b88a5179', 'Ham chơi vào chốn Ta Bà
Hàng trăm tỷ kiếp quên Nhà Quê Xưa
Trải qua bao kiếp gió mưa
Vui buồn khổ não vẫn ưa chơi hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.218Z', '2026-06-16T03:08:15.218Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_38viy_1', 'bc7aa7d8-1d5a-4e82-ad77-aa91b88a5179', 'Qua muôn kiếp sống mệt nhoài
Ham mê danh lợi nhận hoài khổ đau
Hốt phân cứ ngỡ làm giàu
Trôi lăn tỷ kiếp vẫn màu xám đen', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.218Z', '2026-06-16T03:08:15.218Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_lx2l7_2', 'bc7aa7d8-1d5a-4e82-ad77-aa91b88a5179', 'Tìm Châu nên phải bon chen
Hơn thua giành giật sống hèn với nhau
Nhà mình vốn sẵn Bảo Châu
Mà không chịu nhận kiếm đâu bên ngoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.218Z', '2026-06-16T03:08:15.218Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_1czx4_3', 'bc7aa7d8-1d5a-4e82-ad77-aa91b88a5179', 'Cha luôn không tiếc mệt nhoài
Giúp muôn con thoát ra ngoài ngu si
Nhưng đàn con trẻ vẫn lì
Gặp ngay trước mắt kiên trì tránh Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.218Z', '2026-06-16T03:08:15.218Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_ctq8p_0', '27782196-b6ed-4594-9394-600035a32ed0', 'Nghỉ Cha đến đón chỉ là dụ thôi
Cha đành diệu dụng giả trôi
Hốt phân Cha vẫn giúp lôi con về
Giúp bao con hết u mê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_pjigl_1', '27782196-b6ed-4594-9394-600035a32ed0', 'Nghe lời Cha bảo đi về Nhà ta
Con làm mọi thứ trong Nhà
Chẳng cần suy nghĩ thế mà con An
Thấy Nghe Nói Biết rõ ràng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_33pwu_2', '27782196-b6ed-4594-9394-600035a32ed0', 'Về đây mới biết là đàng Bảo Châu
Về đây mới biết Cha giàu
Về đây mới biết mình giàu như Cha
Từ nay con hết la cà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_rcusv_3', '27782196-b6ed-4594-9394-600035a32ed0', 'Không ham lang bạt Ta Bà loanh quanh
Về Nhà hết tử hết sanh
Là nơi thanh tịnh đất lành Quê Xưa
Ai ơi đừng đợi sớm trưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_e6pvl_4', '27782196-b6ed-4594-9394-600035a32ed0', 'Đừng ưa đừng luyến Nhà Xưa hãy về
Về Nhà thoát khỏi vọng mê
Thường Lạc Ngã Tịnh là Quê Niết Bàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.223Z', '2026-06-16T03:08:15.223Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_3qfzl_0', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Bao đời tu chứng thần thông
Thấy mình đắc quả rồi ngông ở đời
Thấy ai cũng phán mọi thời
Phân chia tốt xấu lại rời Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_67w5n_1', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Nghĩ rằng mình chẳng đi sai
Ngờ đâu là lối trôi hoài vạn năm
Người lại tìm Ngọc xa xăm
Vượt non lội suối lại lầm lạc trôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_gswvz_2', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Cho mình chứng đắc quả rồi
Dính bao huyển tướng ôi thôi lạc đường
Mắt càng lâm cảnh mù sương
Đường mình không rõ đòi thương đường người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_qwim0_3', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Gặp người tâng bốc thì tươi
Gặp người nói thật thì cười bực tâm
Gánh bao ngày tháng âm thầm
Đến khi mệt mỏi phá ầm tan hoang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_ukvfn_4', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Lại còn lôi kéo người ngay
Khiến bao huynh đệ lung lay tín lòng
Bản thân thì cứ lòng vòng
Lại làm Nhất Xiển Đề còng Phật nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_f63wl_5', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Nay Vô chỉ rõ ân cần
Đường nào chứng đắc Thánh Thần dẫn đưa
Muốn về được chốn quê xưa
Ở yên Tự Tánh chẳng ưa cảnh gì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_f7ouq_6', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Là nơi bất khả tư nghì
Ham mê chứng đắc lại đi luân hồi
Nay Vô để lại chữ "Thôi"
Thôi "Tu" Thôi "Chứng" sẽ Thôi lòng vòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_pzvn1_7', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Hành nơi Tự Tánh là xong
Thấy Nghe Nói Biết rõ thông Niết Bàn
Ở nơi Pháp Thể thanh nhàn
An nhiên người bước trên đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_heix1_8', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Con Ta nhớ lấy chỗ này
Mắt con u tối đau hoài mắt Ta
Đi đâu hãy nhớ về Nhà
Đừng mê rong ruổi la cà thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_hzkx8_9', '885b68c8-843a-4a72-9b07-12dd23e6041b', 'Về Nhà là chốn hằng an
Không vọng không tưởng là đàng thật chân
Về đây rõ biết Pháp Thân
Thường lạc ngã tịnh mười phân viên tròn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.229Z', '2026-06-16T03:08:15.229Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_r333d_0', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Sống trong nhân thế buộc ràng
Dính chặt hình tướng mất đàng Vô Sanh
Cuộc đời cứ mãi loanh quanh
Chỉ vì chấp tướng phải đành trôi lăn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_lnv7k_1', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Thế là cứ mãi lăng xăng
Muôn đời mò bắt ánh trăng trong đầm
Chấp chặt huyễn cảnh mê lầm
Luân hồi sanh tử vạn năm cõi trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_cu70a_2', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Nay Vô khai mở ân cần
Buông ngay chấp tướng rõ thân Phật Đà
Đời người sẽ thoát cảnh ma
Nhìn ra thật tướng Ta Bà phiêu du', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_b7bzv_3', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Muốn thông tỏ được chữ Tu
Tướng sanh không dính hết Ngu ngay mình
Từ nay người rõ sự tình
Tướng dù tốt xấu do mình sanh tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_bszmn_4', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Dù Tu ngàn kiếp ngàn năm
Người còn chấp tướng vẫn nằm thế gian
Tướng sanh tướng sẽ tự tan
Ai mà không dính là an muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_zjp4q_5', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Người ơi khi sống ở đời
Dính vào hình tướng sẽ rời Như Lai
Muốn luôn sống đúng không sai
Nhận ra Tự Tánh hành hoài hằng an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_a44bb_6', 'fd2d4244-1ae0-4f68-9d2c-e6799c6a1ac6', 'Sống luôn tỉnh thức rõ ràng
Thấy Nghe Nói Biết tỏ đàng Chân Như
Từ nay thoát cảnh huyển hư
Đời người thanh tịnh cùng chư Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.233Z', '2026-06-16T03:08:15.233Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_73vc0_0', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Huệ Tịnh con xin Kính trình kệ Cúng Dường Sư Cha 🙏🙏🙏
Cảm niệm Cha từng giây từng phút
Vì con thơ không quản nhọc nhằn
Thân hiện thể có bị nát bằm', 'Đểu Đồng Thành Phật Đạo
.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_tykzt_1', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Vì con trẻ bằng lòng tất cả
Dù ứng thể có bị mệt lả
Miễn con thơ vững chãi bước đi
Cho con thấy chỗ Bất Tư Nghì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_a93e1_2', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Người không vì điều gì nơi trẻ
Giúp con tìm được chốn Quê Xưa
Thuyền bát nhã Cha đã đón đưa
Đưa con trẻ về nơi Chánh Giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_qr6im_3', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Miễn đàn con thoát được kiếp nạn
Vạn năm nay vùng vẫy kêu la
Đàn con thơ vẫn cứ la cà
Nơi cửa tử không nhà không cửa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_xpvx9_4', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Hiện đang ngồi tại nơi biển lửa
Ngỡ mình ngon dắt bạn về cùng
Lại ngờ đâu đi phải cái hùng
Vì thằng đui dắt phải thằng khùng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_i3lae_5', '4aa263d7-b58e-4d6d-be54-c837f3f5f05e', 'Vẫn lùng bùng ở trong biển lửa
Nơi cha lành muôn vàn cách chữa
Biết nghe lời hành chốn tự thân
Hành sớm tối luôn thật ân cần
Nơi chân tánh liền được sáng tỏ
Huệ Tịnh 13/08/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.238Z', '2026-06-16T03:08:15.238Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_sm1c6_0', '79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Huệ Tịnh con xin Kính trình kệ Cúng Dường Sư Cha Tam Vô
Lời Cha kỳ diệu bao nhiêu
Chỉ tôi thoát nạn bao điều khổ đau
Bao nhiêu tỷ kiếp khổ sầu', 'Hướng Về Khắp Tất Cả
Con cảm niệm sư cha, con xin dâng bài kệ cúng dường sư cha
Con cảm niệm ân cha', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_lomlv_1', '79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Lặn lội tìm kiếm bến nào thoát thân
Mà sao con mãi cứ đần
Lặn lên ngụp xuống chẳng hơn phân nào
Đại duyên con gặp được Người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_utcry_2', '79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Cha lành dẫn lối chỉ đường Về Quê
Từ nay con hết u mê
Không thâu không thọ là quê hương mình
Từ nay con nguyện hằng minh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_cmcok_3', '79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Thấy nghe nói biết thấy mình an yên
Từ nay con hết ưu phiền
Chấp tay con nhận những lời Cha trao
Cảm niệm ơn người biết bao', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_woq5k_4', '79c57112-b4ec-4e81-9547-c20e5dc47a5e', 'Cho con thấy được chỗ Chư Phật Đà
Từ nay con hết la cà
Ơn Cha con trẻ khắc ghi đời đời
Con luôn niệm Phật muôn thời
Thường hành Tự Tánh về nơi Phật Đài
Huệ Tịnh 05/06/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.242Z', '2026-06-16T03:08:15.242Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_e9ul4_0', 'b66dff59-6a70-4bd9-9f48-fd5b709576dd', 'Đạo đời cứ thuận tùy duyên
Muôn người Vọng Tưởng rước phiền vào thân
Lăng xăng trong chốn hồng trần
Dù Phật đến rước vạn lần vẫn trôi', '1. "Đạo đời cứ thuận tùy duyên / Muôn người Vọng Tưởng rước phiền vào thân"
* "Đạo đời cứ thuận tùy duyên": Sư Tam Vô giải thích rằng trong cuộc sống, mọi nhân duyên đều là thuận lợi. Con người vì ngu dốt, không hiểu biết rõ ràng nên mới thấy duyên nghịch. Thậm chí, những người này có thể biến những điều tốt đẹp thành xấu xa. Việc thuận theo duyên nghĩa là chấp nhận mọi hoàn cảnh, vì tất cả đều là "thuận".
* "Muôn người Vọng Tưởng rước phiền vào thân": Đây là ý chính của bài kệ. Sư Tam Vô nhấn mạnh rằng chính "vọng tưởng" là nguyên nhân khiến con người tự rước phiền não, tự khổ, tự khóc. "Cái tưởng nó ghê lắm đó con, cái tưởng nó không dừng chỗ nào hết đó".
2. "Lăng xăng trong chốn hồng trần / Dù Phật đến rước vạn lần vẫn trôi"
* Con người bận rộn, quay cuồng trong thế giới trần tục vì những vọng tưởng của mình. Ngay cả khi Phật đến đón độ vô số lần (không chỉ vạn lần mà là hàng tỷ lần qua các kiếp luân hồi), con người vẫn trôi dạt. Lý do là vì họ không nhận ra Phật ở ngay trong bản thể của mình, tức là Phật tánh của chính họ. Họ cứ niệm Phật (ví dụ như "A Di Đà Phật") với mong muốn được về Tây phương Cực Lạc nhưng lại không thấy được Cực Lạc mà chỉ thấy cực khổ, vì họ không thấy được Phật ở ngay chính bản thể của mình.
3. "Lang bạc tìm kiếm xa xôi / Ngờ đâu hạnh phúc tại ngôi nhà mình"
* Con người tìm kiếm hạnh phúc ở những nơi xa xôi, lang bạt khắp chốn, nhưng không ngờ rằng hạnh phúc đã có sẵn ngay trong "ngôi nhà mình". "Ngôi nhà mình" chính là bản thể, là nơi mà khi con người ở yên ngay đó thì tâm thức sẽ an nhiên tự tại và hạnh phúc.
4. "Là nơi bất tử bất sinh / Ngay mình không ở Tưởng chi trôi hoài"
* Bản thể của chúng ta là nơi bất tử, bất sinh. Nó là bản thể Như Lai, không có hình tướng hay vật chất nên không có sinh tử. Nếu không ở yên trong bản thể này mà lại chạy theo "cái tưởng" của mình, con người sẽ mãi trôi dạt.
5. "Muốn tan biến kiếp mệt nhoài / Dừng ngay cái Tưởng không ngoài không trong"
* Để chấm dứt những kiếp sống mệt mỏi, đau khổ, điều cần làm là dừng ngay cái "tưởng". "Không ngoài không trong" có nghĩa là không chạy theo những tưởng tượng bên ngoài hay những tưởng tượng bên trong tâm thức của mình. Không chạy theo tưởng của người khác hay tưởng của chính mình, mà là ở yên ngay bản thể của mình, nơi không có trong, ngoài, trên, dưới, trước, sau.
6. "Hành ngay Tự Tánh là xong / Tưởng chi rồi phải lông bông sáu đàng"
* Việc hành ngay Tự Tánh (sống đúng với bản chất thật của mình) là cách để giải thoát. Nếu vẫn cứ "tưởng", con người chắc chắn sẽ luân hồi trong sáu nẻo (địa ngục, ngạ quỷ, súc sanh, nhân, thần, trời).
7. "Không Vọng không Tưởng tự an / Muôn thời người mãi sống nhàn thảnh thơi"
* Khi không còn chạy theo "vọng" (tham muốn, ảo tưởng) và "tưởng" (suy nghĩ sai lầm), con người sẽ tự nhiên được an lạc. Họ sẽ sống một cuộc đời nhàn hạ, thảnh thơi. Khi không vọng không tưởng, con người sẽ thấy biết rõ ràng mọi thứ mà không bị dính mắc vào bất cứ điều gì.
8. "Ung dung trần cảnh dạo chơi / Tùy duyên tỉnh thức Đạo Đời thong dong"
* "Ung dung trần cảnh dạo chơi": Điều này có nghĩa là sống một cách tự do, không bị bất cứ điều gì ràng buộc, ngay cả khi những cảnh trần tục diễn ra trước mắt cũng không sao.
* "Tùy duyên tỉnh thức Đạo Đời thong dong": Đây là trạng thái cuối cùng và cũng là điều cốt lõi. Sư Tam Vô giải thích rằng "tùy duyên tỉnh thức" nghĩa là trong mọi nhân duyên, chúng ta đều thấy nghe biết rõ ràng thân và tâm này hành với trần cảnh ra sao. Điều quan trọng là phải biết rõ ràng mà không dính mắc. Tỉnh thức mà không dính mắc sẽ giúp con người sống thong dong, tự tại cả trong đời sống thế tục (Đời) lẫn trên con đường tu tập (Đạo).
Mối liên hệ giữa "Tưởng" và sự giãn nở của vũ trụ: Sư Tam Vô còn đưa ra một quan điểm độc đáo về sức mạnh của "tưởng". Ông liên hệ "cái tưởng" của con người với sự giãn nở của vũ trụ. Ông chỉ ra rằng các nhà khoa học, với kính viễn vọng của mình, liên tục phát hiện ra vũ trụ rộng lớn hơn những gì họ từng nghĩ (ví dụ, từ 14 tỷ năm ánh sáng đến 50 tỷ, 100 tỷ năm ánh sáng và hơn nữa). Khi lý thuyết Big Bang (nổ cách đây 14 tỷ năm) không còn đủ để giải thích sự tồn tại của các hành tinh xa hơn, họ phải thừa nhận "Vũ trụ giãn nở". Sư Tam Vô khẳng định rằng nguyên nhân của sự giãn nở này chính là "chữ tưởng" hay "vọng tưởng". Ông giải thích: "Chúng mày càng tưởng nó càng lan rộng ra, nó càng tạo ra đủ thứ cái mọi thứ trên đời này... Càng tưởng nó càng sinh ra nhiều thứ chứ sao". Điều này ngụ ý rằng "tưởng" không chỉ tạo ra phiền não cá nhân mà còn có sức mạnh kiến tạo cả Tam Thiên Đại Thiên Thế Giới, khiến vũ trụ liên tục giãn nở. Ông thậm chí còn nói vui rằng "tưởng" giúp các nhà khoa học có công ăn việc làm, nhưng trước hết và quan trọng nhất, "tưởng" sẽ làm cho chính bản thân người tưởng mệt mỏi.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.247Z', '2026-06-16T03:08:15.247Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_n2wih_1', 'b66dff59-6a70-4bd9-9f48-fd5b709576dd', 'Lang bạc tìm kiếm xa xôi
Ngờ đâu hạnh phúc tại ngôi nhà mình
Là nơi bất tử bất sinh
Ngay mình không ở Tưởng chi trôi hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.247Z', '2026-06-16T03:08:15.247Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_imecg_2', 'b66dff59-6a70-4bd9-9f48-fd5b709576dd', 'Muốn tan biến kiếp mệt nhoài
Dừng ngay cái Tưởng không ngoài không trong
Hành ngay Tự Tánh là xong
Tưởng chi rồi phải lông bông sáu đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.247Z', '2026-06-16T03:08:15.247Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162355_la0e1_3', 'b66dff59-6a70-4bd9-9f48-fd5b709576dd', 'Không Vọng không Tưởng tự an
Muôn thời người mãi sống nhàn thảnh thơi
Ung dung trần cảnh dạo chơi
Tùy duyên tỉnh thức Đạo Đời thong dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.247Z', '2026-06-16T03:08:15.247Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_d0js6_0', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Bao năm tìm Đạo thoát mê
Mong nhận lối thoát biết về Nhà Xưa
Trôi lăn bao kiếp gió mưa
Thần thông chứng đắc đường Xưa khó tìm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tnn7c_1', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Dù cho Thấy tận cõi thiên
Cũng còn mờ mịt thấy miền Như Lai
Thông được Thiên Nhãn còn Sai
Nhìn hoài nhìn mãi mê hoài vọng tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_inkh9_2', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Dù cho nghe tận thiên âm
Sẽ càng xa cách Vua Âm ngay mình
Thông được Thiên Nhĩ u minh
Nghe hoài âm mãi diệt sinh luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_j24id_3', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Dù cho biết được ý người
Chấp chặt chứng tỏ rồi cười chúng sanh
Thông được Tâm vẫn loanh quanh
Dính vào võ đoán lại sanh cõi Thần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_mnveu_4', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Dù cho thoát khỏi nhục thân
Thấy mình biến hoá phân thân tuyệt vời
Ngờ đâu ngàn kiếp chơi vơi
Dính vào Thần Túc muôn thời trôi lăn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_6ba40_5', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Người ơi đừng có lăng xăng
Tỏ tường quá khứ lại ăn khổ sầu
Vị Lai rõ chắc được đâu
Mà người vẫn dính vẫn cầu Mạng Thông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_hj6q0_6', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Người ơi chớ vọng chớ mong
Ưu tư phiền não trong lòng đeo mang
Muốn cho mình mãi an nhàn
Thông muôn lậu hoặc là đàng an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_2o3pp_7', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Muốn cho hết bị đảo điên
Người luôn tỉnh thức ở yên Tánh mình
Là nơi bất tử bất sinh
Thường hành nơi ấy quang minh tỏ tường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_zauiw_8', '6ae6f2dd-9230-4c2d-b9d5-11fae68f4a42', 'Không còn đắm cảnh mù sương
Không mê chứng đắc là đường Chân Như
Đại duyên Vô gửi mấy Từ
Vô Tu Vô Chứng thị thời Đạo Nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.252Z', '2026-06-16T03:08:15.252Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_fby4w_0', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Bao năm cầu đạo thoát mê
Mong tìm được lối đi về Nhà Xưa
Trãi qua bao cảnh nắng mưa
Vẫn không thấy được đường xưa nơi nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_ryi55_1', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Hữu duyên Vô vẽ chút màu
Chỉ ra lối cũ để vào Như Lai
Nhưng người cứ chọn lối sai
Hiểu được một chút khoe hoài Ngã Nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_2jwav_2', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Lại cho đại chúng bị đần
Thể hiện hiểu biết phá đần chúng sanh
Bản thân còn mãi loanh quanh
Vậy mà Vọng Độ tịnh thanh cho người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_b6uag_3', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Tưởng đâu mình đạt điểm mười
Ngờ đâu bị chúng cười vào mặt cho
Lộ ra cái Ngã rất To
Sân si lý luận tự cho đúng rồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_hhz1w_4', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Đại duyên Vô tặng chữ "Thôi"
Thôi luận Thôi lý càng Thôi Vọng Độ
Thoát ra các cảnh xô bồ
Ai ai cũng Phật người Rồ làm chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_v2gd5_5', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Nay duyên Vô chỉ cách ni
Cầm Tô dạo bước mỗi khi ra đường
Hữu duyên gieo hạt chân thường
Luôn hành tiếp dẫn rõ phương Quê Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_klhr0_6', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Ai cầu sẽ rất thiết tha
Ai nghi người chớ Ta Bà sân si
Đường mình mình hãy cứ đi
Đường người người bước có gì phân bua', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_fn57o_7', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Từ nay thoát cảnh hơn thua
Không còn vọng tưởng độ cho muôn loài
Người liền thoát cảnh mệt nhoài
Hành nơi Tự Tánh sẽ hoài an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_f05vz_8', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Nay Vô thuyết lại chữ duyên
Ai nhận đại phúc ở yên nơi mình
Đại duyên Vô gửi chút tình
Người nhận liễu Ý bỏ lời Vô trao', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_pn5au_9', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Vạn lời cũng chỉ tào lao
Lìa Tự liễu Nghĩa hành mau về Nhà
Muốn cho thoát cảnh la cà
Thôi đi vọng độ thế là hằng an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_17w75_10', 'bb8c418b-5ddf-44ec-92e0-c0aed117d75c', 'Nguyện cho đại chúng an nhàn
Thường hành Tự Tánh rõ đàng Như Lai
Nguyện người thoát cảnh bi ai
Rõ mình không vật chính ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.259Z', '2026-06-16T03:08:15.259Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_nw5mn_0', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Sắc ơi sao đẹp tuyệt trần
Làm cho ai đắm thất thần đê mê
Sắc ơi sao lại xấu ghê
Làm cho ai oán trách chê đủ điều', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_r9uet_1', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Thanh ơi sao tiếng mỹ miều
Làm cho ai luyến yêu kiều diệu âm
Thanh ơi sao tiếng vang ầm
Làm cho ai khổ ai gầm sân si', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_syh56_2', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Hương ơi sao tỏa diệu kỳ
Làm cho ai ái mùi chi thơm lừng
Hương ơi sao thối quá chừng
Làm cho ai bực muốn ngừng thở luôn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_2sowz_3', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Vị ơi ngon quá khó buông
Làm cho ai đắm dính luôn không rời
Vị ơi dở quá hết lời
Làm cho ai chán cả đời né xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_467sl_4', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Xúc chạm thoải mái vậy ta
Làm cho ai luyến cứ va thân vào
Xúc chạm khó chịu thế nào
Làm cho ai giận lập rào cách xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_g8tt4_5', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Pháp ơi thuận ý thế mà
Làm cho ai cũng thích va thọ vào
Pháp mà nghịch ý thì sao
Làm cho ai cũng lao đao xa rời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_yn66a_6', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Lục trần tội chi ở đời
Mà sao tu giả buông lời trách than
Thuận thời không tiếng than van
Nghịch thời đổ lỗi trần gian cuốn mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_6917z_7', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Ai ơi xem xét sự tình
Lục trần có lỗi hay mình tự gây
Tánh mình vốn sẵn ngay đây
Vốn hằng thanh tịnh chẳng dây dính trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_qwmos_8', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Thế mà người vẫn muôn lần
Dính vào trần cấu hỏi mần sao ra
Ai ơi Dừng khởi vọng ma
Dừng Phiền trần cấu thế là tự an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_cu3x7_9', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Ở yên Tự Tánh sẽ nhàn
Dừng Phiền trần cấu là đàng Như Lai
Tánh và trần cấu là hai
Dừng Phiền trần cấu ở ngay Tánh mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_0ys55_10', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Từ nay người mãi hằng minh
Thường hành Tự Tánh nơi mình An nhiên
Đời người hết bị đảo điên
Người luôn an lạc ưu phiền bất sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_ahfvx_11', 'ce1746f0-4dcf-44de-b597-27d374cee2ed', 'Đời người hết bị loanh quanh
Về nơi thanh tịnh đất lành Quê Xưa
Người ơi đừng ngại sớm trưa
Dừng Phiền trần cấu Nhà Xưa rõ đường
Nay duyên Vô chỉ tỏ tường
Người mau nhận lấy Đạo Thường Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.264Z', '2026-06-16T03:08:15.264Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_2k3bc_0', '3b6acf53-104d-44ec-921c-45d6ec9d4435', 'Bao năm chung sống một nhà
Lúc vui lúc khổ vẫn chà đạp nhau
Rảnh rang soi mói nỗi đau
Tìm sâu trong lá gieo sầu cho nhau', 'Dưới đây là phân tích chi tiết những ý chính của bài kệ:
* Bao năm chung sống một nhà, lúc vui lúc khổ vẫn chà đạp nhau; Rảnh rang soi mói nỗi đau, Tìm sâu trong lá gieo sầu cho nhau.
* "Cha" giải thích rằng "một nhà" không chỉ là những người sống chung trong gia đình nhỏ mà còn rộng hơn là "tất cả chúng sanh, tất cả mọi người đều ở trong một nhà" vì "vạn vật đồng nhất thể".
* Cha chỉ ra thực trạng con người, dù vui hay khổ, vẫn có xu hướng "chà đạp nhau". Điều này thể hiện qua việc nói xấu, "khịa nhau, chọt nhau".
* Điểm mấu chốt là con người thường "rảnh rang soi mói nỗi đau" của người khác, thậm chí "tìm sâu trong lá gieo sầu cho nhau". "Cha" nhấn mạnh sự vô lý của việc "soi con sâu tùm lum á bên ngoài" trong khi lại không "soi con sâu bên trong mình". Thay vì nhìn vào lỗi lầm của bản thân, người ta lại tập trung vào khuyết điểm của người khác để gây thêm phiền não.
* Sống sao cho cả nhà giàu, Đừng vì bản ngã làm đau nhà mình.
* Khái niệm "giàu" ở đây không phải là giàu có về vật chất mà là "biết đủ". Khi một người biết đủ, họ sẽ "không còn cảm thấy thiếu thốn", từ đó dẫn đến trạng thái "không tham, không sân, không si", không chạy theo "tánh ma" mà "ở yên ngay cái nhà của mình, ở yên ngay bản thể của mình".
* "Bản ngã" (cái tôi) là nguyên nhân gây ra sự đau khổ. "Cha" khẳng định rằng "mình vì cái tôi, cái ngã của mình làm tổn thương đến bản thân mình và tổn thương đến người khác", bởi vì không nhớ rằng "tất cả mọi người xung quanh đều là người nhà với nhau hết đó".
* Vạn sự ta cứ lặng thinh, Thâu nhận tất cả chẳng mình chẳng duyên.
* "Lặng thinh" không đơn thuần là giữ im lặng mà có nghĩa sâu sắc hơn là "nghe đến chỗ thanh tịnh". "Cha" giải thích rằng "âm thanh nó vốn thanh tịnh". Dù ai có nói lời hơn thua, sân si, chửi mắng, xỉa xói, thì ta cũng "nhận hết bởi vì nó vốn thanh tịnh mà". Đó là việc không chạy theo âm thanh hay các sự việc bên ngoài mà nhận ra bản chất thanh tịnh của chúng.
* "Thâu nhận tất cả chẳng mình chẳng duyên" là một trạng thái vô ngã và không chấp trước vào nhân duyên.
* "Chẳng mình": có nghĩa là "mình không hình không vật". Khi không có cái tôi, thì không có gì có thể làm tổn thương ta.
* "Chẳng duyên": "tất cả các duyên sanh diệt nó đều nó vốn như thế". Vạn vật đều đồng nhất thể, nó đều vô ngã, nó không cho nó là gì, thì làm gì có duyên. Mọi thứ đều vô duyên.Việc nhận ra điều này giúp ta chấp nhận mọi thứ, ngay cả khi bị gọi là "vô duyên" hay "vô dụng", vì mình không hình không vật
* Trong nhà có một kẻ điên, Tìm ra kẻ đó soi liền lỗi sai, Liên hồi chửi mắng thẳng tay, Thấy sai liền Đập biết Ai an liền.
* "Kẻ điên" ở đây không phải là một người khác, mà chính là "tánh ma". "Cha" nhấn mạnh rằng "cái thân cái tâm này nó điên thôi chứ không phải tụi con điên". Đó là những suy nghĩ, cảm xúc, thân tâm đang bị mê mờ, không phải bản chất thật của chúng ta.
* "Tìm ra kẻ đó soi liền lỗi sai": Khi "tánh ma" nổi lên, cần tự soi xét lỗi lầm của nó ngay lập tức.
* "Liên hồi chửi mắng thẳng tay": Là hành động tự răn đe, tự vấn bản thân khi cái "tánh ma" xuất hiện, ví dụ như tự hỏi "mày sao mày tào lao, tự nhiên mày sân si hơn thua, bực mình, khó chịu chi vậy".
* "Thấy sai liền Đập biết Ai an liền": "Đập" ở đây là hành động quả quyết dập tắt, chế ngự những phiền não, tánh ma đó. Khi "bợp nó" (đập nó), "tự nhiên mình an tâm mình thôi". Việc thực hành như vậy liên tục sẽ giúp "người hết ưu phiền".
* Từ nay người hết ưu phiền, Sống trong nhà lửa an nhiên ngay mình.
* "Nhà lửa" tượng trưng cho "tam giới" – thế giới của khổ đau và luân hồi.
* Để "an nhiên" (bình an, tự tại) trong "nhà lửa" này, điều quan trọng nhất là "Không chạy theo cái tánh ma của mình". Khi làm được điều đó, sự bình an sẽ tự đến ngay trong bản thân mình.
* Đại duyên Vô gửi chút tình, Nguyện cho đại chúng gia đình An Yên.
* Cuối cùng, "Cha" gửi gắm lời nguyện cho "tất cả chúng sanh, nhà nhà người người đều an nhiên", bằng cách nhận ra bản thể của mình, thấy và đập "kẻ điên" (tánh ma) bên trong mình mỗi ngày.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.271Z', '2026-06-16T03:08:15.271Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_q4zr9_1', '3b6acf53-104d-44ec-921c-45d6ec9d4435', 'Sống sao cho cả nhà giàu
Đừng vì bản ngã làm đau nhà mình
Vạn sự ta cứ lặng thinh
Thâu nhận tất cả chẳng mình chẳng duyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.271Z', '2026-06-16T03:08:15.271Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_cei5q_2', '3b6acf53-104d-44ec-921c-45d6ec9d4435', 'Trong nhà có một kẻ điên
Tìm ra kẻ đó soi liền lỗi sai
Liên hồi chửi mắng thẳng tay
Thấy sai liền Đập biết Ai an liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.271Z', '2026-06-16T03:08:15.271Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_48zd4_3', '3b6acf53-104d-44ec-921c-45d6ec9d4435', 'Từ nay người hết ưu phiền
Sống trong nhà lửa an nhiên ngay mình
Đại duyên Vô gửi chút tình
Nguyện cho đại chúng gia đình An Yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.271Z', '2026-06-16T03:08:15.271Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_kdn1v_0', 'd3ceb3c6-a72d-4196-ac18-3a9d574086a7', 'Vạn vật trên thế gian
Cầu Xin mà có được
Đều là do Mê Lầm
Dễ gặp hàng Quỷ Ma', '1. "Vạn vật trên thế gian / Cầu Xin mà có được / Đều là do Mê Lầm / Dễ gặp hàng Quỷ Ma"
* Lời cảnh báo về sự mê lầm trong cầu xin: Đoạn này khẳng định rằng mọi thứ trên thế gian mà người ta cầu xin, ham cầu, ham xin, ham lạy, ham lộc mà có được, đều là do mê lầm. Sự ham cầu, ham xin này được xem là một dạng của sự mê lầm.
* Nguy cơ gặp phải quỷ ma: Khi cầu xin xuất phát từ sự mê lầm, con người "dễ gặp hàng Quỷ Ma".
* Phân biệt quan trọng giữa "đều là do mê lầm" và "dễ gặp hàng quỷ ma":
* "Vạn vật trên thế gian cầu xin mà có được đều là do mê lầm" nghĩa là tất cả (điều là tất cả) các hành động cầu xin đều xuất phát từ sự mê lầm. Ngay cả việc cầu xin con đường giác ngộ, giải thoát cũng là vì người đó đang mê lầm mới đi tìm đường giải thoát (Chứ đâu có ai tỉnh mà đi tìm đường thoát làm gì)
* Tuy nhiên, "Dễ gặp hàng Quỷ Ma" lại không có nghĩa là toàn bộ (tất cả) những gì người cầu xin gặp được đều là quỷ ma. Đây là điểm mà học trò Thường Tịnh đã mắc lỗi nghiêm trọng khi trình ý hiểu của mình, cho rằng "toàn là gặp hàng quỷ hàng ma". Sự hiểu lầm nàylà "bất kính" và thậm chí là "mất dạy", vì nếu "toàn là gặp quỷ ma" thì ngay cả Cha– người mà biết bao nhiêu đệ tử cầu xin con đường giải thoát – cũng sẽ bị đánh đồng với quỷ ma, kẻ lừa lọc, dụ dỗ. "Cha" đã ghi rất rõ ràng từng câu từng chữ để tránh sai lệch.
2. "Sống thuận theo Nhân Quả / Hiểu biết thật rõ ràng / Gieo Nhân Lành việc tốt / Ắt gặt Quả Phước Sanh"
* Lời khuyên cho người tìm kiếm phước báu: Đoạn này chỉ dẫn cho những người thường xuyên cầu xin, lạy lộc và mong muốn có được phước báu.
* Quy luật nhân quả: Thay vì cầu xin, họ nên sống thuận theo quy luật nhân quả. Điều này đòi hỏi "hiểu biết thật rõ ràng" về quy luật nhân quả.
* Gieo nhân lành, gặt quả phước: Bằng cách "gieo nhân lành việc tốt" (làm những việc thiện lành), họ "ắt gặt Quả Phước Sanh" (chắc chắn sẽ nhận được những quả phước lành).
* Hạn chế của phước sanh: Việc gặt hái quả phước sanh không phải là con đường giải thoát hoàn toàn khỏi luân hồi.
3. "Muốn hết bị loanh quanh / Lìa Luân Hồi Sanh Tử / Rõ Pháp Thân Thanh Tịnh / Thường hành ở nơi ấy / Công Đức vô lượng sanh / Giải thoát khỏi Tam Giới / Thấu triệt hết nhân sinh / Thường hành trong thanh tịnh / Dù Tam Thiên tan vỡ / Vẫn ung dung tự tại"
* Con đường giải thoát khỏi luân hồi: Để "hết bị loanh quanh" và "lìa Luân Hồi Sanh Tử" (thoát ly khỏi vòng luân hồi sinh tử), điều quan trọng là phải "rõ Pháp Thân Thanh Tịnh". "Pháp thân" ở đây được giải thích là cái "thân thứ ba của mình".
* Thường hành trong Pháp Thân: Khi đã "rõ Pháp Thân Thanh Tịnh", cần phải "Thường hành ở nơi ấy", tức là luôn ở tánh thấy, nghe, biết rõ ràng, không chấp trước hay dính mắc.
* Phát sinh công đức vô lượng: Việc thường hành tại Pháp Thân Thanh Tịnh mà không dính mắc sẽ sinh ra "Công Đức vô lượng"
* Giải thoát khỏi Tam Giới: Chính những công đức vô lượng này giúp một người "Giải thoát khỏi Tam Giới" (thoát khỏi sự trói buộc của ba cõi).
* Trạng thái sau giải thoát: Khi đã giải thoát, người đó không còn bị trói buộc bởi bất cứ điều gì, có thể "Thấu triệt hết nhân sinh" (thấu hiểu trọn vẹn mọi lẽ sống của con người) và "Thường hành trong thanh tịnh" (luôn sống trong trạng thái thanh tịnh).
* Ung dung tự tại bất kể biến cố: "Tam Thiên tan vỡ" (dù tam giới hay thế giới có bị hủy diệt), người đó vẫn "ung dung tự tại" (thảnh thơi, tự tại) ở trong đó.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.276Z', '2026-06-16T03:08:15.276Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_p4kzs_1', 'd3ceb3c6-a72d-4196-ac18-3a9d574086a7', 'Sống thuận theo Nhân Quả
Hiểu biết thật rõ ràng
Gieo Nhân Lành việc tốt
Ắt gặt Quả Phước Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.276Z', '2026-06-16T03:08:15.276Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_pwwib_2', 'd3ceb3c6-a72d-4196-ac18-3a9d574086a7', 'Muốn hết bị loanh quanh
Lìa Luân Hồi Sanh Tử
Rõ Pháp Thân Thanh Tịnh
Thường hành ở nơi ấy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.276Z', '2026-06-16T03:08:15.276Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_kfpg9_3', 'd3ceb3c6-a72d-4196-ac18-3a9d574086a7', 'Công Đức vô lượng sanh
Giải thoát khỏi Tam Giới
Thấu triệt hết nhân sinh
Thường hành trong thanh tịnh
Dù Tam Thiên tan vỡ
Vẫn ung dung tự tại', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.276Z', '2026-06-16T03:08:15.276Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_sulyr_0', 'f0aec85b-a166-4d07-8f26-b259c2479667', 'Của mình thì mãi của mình
Nếu mà không phải tham cầu được sao
Bao năm lận đận lao đao
Cố mà níu giữ làm sao an lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.283Z', '2026-06-16T03:08:15.283Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_26rih_1', 'f0aec85b-a166-4d07-8f26-b259c2479667', 'Buông đi cái Chấp lòng vòng
Nhận ngay Ngọc Quý ở mình đâu xa
Chỉ cần vọng niệm không va
Ở ngay Tự Tánh là Nhà thường An
Đời người sẽ mãi an nhàn
An nhiên tự tại trên đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.283Z', '2026-06-16T03:08:15.283Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_snf5d_0', 'a4e4cc7f-9366-4137-8a1c-811500a0acf8', 'Đời này thử hỏi có ai
Sinh già bệnh chết tránh hoài được không
Vậy mà người cứ lông bông
Chấp chặt thân xác cứ mong sống hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.288Z', '2026-06-16T03:08:15.288Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_e1rqu_1', 'a4e4cc7f-9366-4137-8a1c-811500a0acf8', 'Trôi lăn sinh tử chín loài
Làm sao người thoát ra ngoài tử sanh
Muốn cho hết bị loanh quanh
Nhận ra Tự Tánh mà Hành thường xuyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.288Z', '2026-06-16T03:08:15.288Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_1x9jc_2', 'a4e4cc7f-9366-4137-8a1c-811500a0acf8', 'Từ nay hết bị đảo điên
Đời người chơn chánh ưu phiền tránh xa
Thường Ăn Bát Cháo ở Nhà
Sinh Già Bệnh Chết Sẽ tha người liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.288Z', '2026-06-16T03:08:15.288Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_k25ek_3', 'a4e4cc7f-9366-4137-8a1c-811500a0acf8', 'Từ nay người mãi an yên
Ung dung người bước về miền Quê Xưa
Khi người gặp cảnh nắng mưa
Húp ngay Bát Cháo Hành đưa về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.288Z', '2026-06-16T03:08:15.288Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_hc7y8_0', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Ở Tánh Không Chân Như
Không có lấy một tướng
Vậy Địa Ngục ở đâu
Thiên Đàng cũng ở đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_bgm9n_1', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Đều là do vọng động
Sanh ra muôn kiến chấp
Đặt Địa Ngục Thiên Đàng
Rồi tự trói bản thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_xvu5q_2', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Dính chặt vào kiến chấp
Không thoát khỏi Huyễn Thân
Tức ở ngay Địa Ngục
Giam mình nơi trần cấu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_qmju5_3', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Rồi trôi lăn lặn ngụp
Chịu Luân Hồi Sanh Tử
Muốn thoát ra huyễn cảnh
Chỉ cần rõ Pháp Thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_jngs9_4', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Sống thường hằng nơi ấy
Bất nhiễm muôn huyễn hoặc
Quán Ngũ Uẩn đều không
Tứ Đại cũng đều không', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_99wid_5', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Soi tất cả các Pháp
Mọi Thứ đều là không
Liền không dính vạn Pháp
Tự thoát khỏi Địa Ngục', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_nos2q_6', 'c13a2653-3dc1-4119-a43c-045551fcfcc2', 'Sống Ung Dung Tự Tại
Thường hành nơi Tự Tánh
Rồi hoá độ quần sanh
Bồ Đề Viên Mãn Thành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.293Z', '2026-06-16T03:08:15.293Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_zezrm_0', '7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Mọi người bệnh tật than van
Mong cho hết bệnh để An muôn thời
Nhưng mà đã lãnh cái thân
Sinh già bệnh tử một lần phải qua', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_km4l4_1', '7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Nhưng khi đổ bệnh thế là
Thân tâm đau khổ mong qua bệnh này
Nhân duyên Vô chỉ cách này
Không Người Không Nước Biết Ngay Hết Liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tr85d_2', '7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Chỉ cần thấy tướng không theo
Nhận ra Pháp Tánh thường hằng Chân Như
Rõ thân tứ đại là hư
Không người uống nước Tánh Như Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_kmyc2_3', '7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Nước vô Biết rõ vậy mà
Ở ngay tánh Biết rõ nhà Như Lai
Thân người Vô Vật không hai
Không hình không tướng làm sao nhiễm trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_rufni_4', '7ed503cd-4229-4e42-9ef6-c1cd6373466d', 'Bệnh thời không ở Pháp Thân
Người nên sống ở Chân Thân của mình
Ở nơi chốn ấy thanh bình
An nhiên tự tại biết mình Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.298Z', '2026-06-16T03:08:15.298Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_ddssa_0', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Tịnh Châu con xin Kính trình kệ Cúng Dường Cảm Niệm Sư Cha Tam Vô!
Vạn năm trong cõi ta bà
Trải qua bao kiếp tìm nhà nơi đâu
Thân người nào có bấy lâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_u4e1j_1', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Hữu duyên Phật Pháp tin sâu nhiệm màu
Gặp Sư con biết mình giàu
Sư cho danh mới Tịnh Châu là nhà
Châu trong Châu báu ngọc ngà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_24xk4_2', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Chính tại thân Phật chẳng xa kiếm tìm
Tịnh là thanh tịnh tinh nguyên
Tịnh Châu thường niệm luôn chuyên hành trì
Hành trong ăn uống ngủ đi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_qamme_3', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Hành trong lời nói hành khi mình làm
Hành sao buông được chữ tham
Buông luôn chữ giận chữ si lầm đường
Sư cho con biết vô thường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_1c114_4', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Thấy sắc không dính con thường chớ quên
Nghe âm không dính con nên
Biết sắc âm giả mà lên đường về
Pháp thân mình chính là quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_16p1y_5', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Sư Cha khai thị phá mê luân hồi
Con đây xúc động không thôi
Rưng rưng nước mắt khôn nguôi trực trào
Cảm niệm ân đức Sư Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_bw00v_6', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Cho con được biết về nhà Như Lai
Lời Sư nói một không hai
Con xin ghi nhớ gắng phải thực hành
Nguyện cho hiện thể Sư lành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_cy7we_7', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Dẫn đường chỉ lối con thành Phật xưa
Lạy Sư giảng Pháp dẫn đưa
Con cùng huynh đệ xin thưa đồng lòng
Trình Sư bài kệ kính mong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tqx6c_8', '1c1f2219-8da1-49fe-8011-527e807f2cdd', 'Tỏ bày ý nguyện con trong Tánh từ
Ngàn lần cảm niệm Ân Sư
Khai thị Giáo Pháp con như trở về
Con xin quyết tỉnh không mê
Giác ngộ giải thoát thế gian vô thường!
Tịnh Châu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.303Z', '2026-06-16T03:08:15.303Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_a0o9y_0', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Tịnh Châu con xin trình kệ Cúng Dường Sư Cha Tam Vô!
Chẳng mang chín tháng mười ngày
Nhưng ơn giáo dưỡng Cha dạy chúng con
Chỉ con đến chỗ viên tròn', 'Nam Mô Tam Vô Ân Sư
Con xin cảm niệm Ân Sư Cha khai thị!', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_dgxj0_1', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Tái sinh đúng nghĩa ra con trong đời
Sư Cha khai thị bằng lời
Đạo Đời là một tách rời làm chi
Sư Cha khai thị lắm khi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_awjkr_2', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Một hai giờ sáng vẫn vì đàn con
Liễu ý Cha Hành cho tròn
Hành không dính mắc thì con được về
Dừng thôi thoát khỏi sông mê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_akf3e_3', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Bên kia bến Giác là Quê Nhà mình
Cảm niệm ơn Cha tái sinh
Cho đàn con trẻ thấy mình rõ hơn
Cha dạy bỏ vọng bỏ chơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_f41vs_4', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Hành cho rốt ráo không vờn tử sanh
Công đức giác ngộ Thiền Thanh
Buông dừng thôi dứt thì nhanh về Nhà
Thiền Thanh là gốc Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_mlh9d_5', 'f1e091ce-0bde-410d-a53b-b0e43889d33e', 'Thấy Nghe Biết rõ rời xa Ta Bà
Huynh Đệ cảm niệm ơn Cha
Bắc Nam sum họp đúng là tình thân
Kết nối xa về đến gần
Bên nhau dìu dắt về Chân Phật truyền.
Tịnh Châu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.308Z', '2026-06-16T03:08:15.308Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_6fz61_0', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Tịnh Châu con xin Kính trình kệ Cúng Dường Sư Cha Tam Vô!
Lăng xăng rong ruổi ham chơi
Nhầm đường lạc lối mà rơi Ta Bà
Quên luôn đến lối về Nhà', 'Nam Mô Tam Vô Ân Sư
Con xin cảm niệm Ân Sư Cha khai thị!', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_umhgs_1', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Ngộ thời thức tỉnh được Cha đưa về
Cha nghĩ đến đàn con mê
Mà Cha thị hiện dẫn về Quê xưa
Con hạnh phúc khóc như mưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_19abb_2', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Cam lồ hoá hiện chữa liền bệnh Tâm
Nhưng đàn con trẻ mê lầm
Cha chỉ chút một khỏi nhầm lối đi
Nhiều khi con trẻ sinh nghi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_uwr67_3', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Cha lại chỉ dạy từng li từng phần
Tự nhiên con trẻ thấy đần
Ơn Cha cao cả lại lần tánh ma
Sư Cha đã nói không va', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_cd9zk_4', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Mà sao vọng niệm sanh ra liên hồi
Cha nói con hãy dừng thôi
Tham sân si mạn nghi hồi trình Cha
Cha đập phá nát tánh ma', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_vjq67_5', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Mà con vọng tưởng sinh ra luân hồi
Thương Cha con đã rõ rồi
Buông dừng thôi dứt để ngồi tòa sen
Thế gian rối rắm bon chen', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_xofkb_6', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Con trẻ không tỏ dính đen thùi lùi
Cha dùng giáo Pháp gột chùi
Con trẻ sáng tỏ thấy an vui dần
Nhận lại bổn Tánh thật Chân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_eoe7u_7', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Ở nguyên chỗ đó chẳng cần đi xa
Quê nhà con đã nhận ra
Sống luôn tỉnh thức theo Cha về Nhà
Tránh xa cõi tạm Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_765q7_8', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Không sanh không diệt là nhà Như Lai
Chuyến này quyết một không hai
Nghe lời Cha dạy không sai lầm đường
Huynh Đệ con đã tỏ tường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_7wown_9', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Quyết không thối chí kiên cường vững tâm
Cảm niệm Cha luôn âm thầm
Chỉ con chút một chẳng nhầm chẳng sai
Ơn Cha khắc cốt không phai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_j8fxg_10', '7553195f-750c-49cd-a982-59c4bb1d03dc', 'Liễu Hành cho đúng nay mai viên tròn
Cha làm tất cả vì con
Viên tròn mọi thứ cho con trở về
Công Cha ghi nhớ mọi bề
Cảm niệm Người dẫn chúng con về Nhà!
Tịnh Châu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.313Z', '2026-06-16T03:08:15.313Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_e5zm8_0', '07e84257-d983-4586-8ded-2c116666aca7', 'Nay là ngày ... tháng ...
Chúng con thành tâm lập Đám Cảm Niệm
Người mãi ngự ở trong tim
Thành tâm con nhớ nỗi niềm tri ân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_al4ul_1', '07e84257-d983-4586-8ded-2c116666aca7', 'Bao năm người sống ân cần
Gieo bao duyên tốt cho nhân thế này
Phận làm con cháu chẳng hay
Nay người đã bỏ giới này ra đi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_3i253_2', '07e84257-d983-4586-8ded-2c116666aca7', 'Lòng con vẫn mãi khắc ghi
Ân Sinh Nghĩa Dỗ Từ Bi của Người
Trong lòng người hãy vui tươi
Vì con đã thấy tiếng cười Vô Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_hbu3e_3', '07e84257-d983-4586-8ded-2c116666aca7', 'Bao năm con đã loanh quanh
Sân Si theo đuổi mộng xanh cõi đời
Trôi lăn lặn ngụp muôn thời
An đâu chẳng thấy cõi đời Trầm Luân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_7e968_4', '07e84257-d983-4586-8ded-2c116666aca7', 'Tâm con nay đã biết Dừng
Không rong không đuổi Vọng từng theo con
Ân người ví tựa Núi Non
Sanh Thành Dưỡng Dục cho Con kiếp này', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_fybg5_5', '07e84257-d983-4586-8ded-2c116666aca7', 'Hữu duyên con gặp được Thầy
Chỉ con lối thoát khỏi đày Sáu Phương
Thành tâm con nguyện cúng dường
Mười phương chư Phật con đường Bất Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_cqou3_6', '07e84257-d983-4586-8ded-2c116666aca7', 'Kính Dâng một tấm lòng thành
Con nay tinh tấn mãi hành Chân Như
Vì người chưa tỏ thực hư
Nay con nói đến chỗ Chư Phật Đàm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_i9wzs_7', '07e84257-d983-4586-8ded-2c116666aca7', 'Chỉ cần ta biết dừng Tham
Dừng Mê Dừng Vọng Dừng Ham Niết Bàn
Si Mê gốc rẽ muôn đàng
Sanh Tham Sân Ái mở đàng Phiền Tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_w2e0n_8', '07e84257-d983-4586-8ded-2c116666aca7', 'Chỉ cần đối cảnh dừng Tâm
Dừng sanh nhị kiến dừng tâm phân trần
Tâm người sẽ tỏ thiệt chân
Lìa ngay Ái luyến cảnh trần đó ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_wpb28_9', '07e84257-d983-4586-8ded-2c116666aca7', 'Chẳng Ái lấy gì Thọ đây
Không Thọ Không Thủ thoát ngay bụi Trần
Thoát rồi Người sẽ nhẹ Thân
Tâm ta khoan khoái Khinh An nhẹ nhàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_mm8j3_10', '07e84257-d983-4586-8ded-2c116666aca7', 'Lúc này người biết mình An
Lìa được Vọng Chấp là Đàng Vô Sanh
Nhưng còn cái Biết đã thành
Tánh Nhân hiển lộ phải đành lìa luôn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_xqodw_11', '07e84257-d983-4586-8ded-2c116666aca7', 'Lìa Nhân Giác Trí lại tuông
Trí kia biết Giác phải buông ngay liền
Từ nay Tâm hết ưu Phiền
Nhưng còn Ngã tướng biết Phiền lìa Ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_rhy3p_12', '07e84257-d983-4586-8ded-2c116666aca7', 'Thôi thì ta cứ Độ Tha
Đến khi chẳng thấy có Ta Độ Người
Thân Tâm thơi thới vui cười
An Nhiên tự tại phương mười Phật Chư', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_5t8qq_13', '07e84257-d983-4586-8ded-2c116666aca7', 'Hồng trần ảo vọng huyễn hư
Bụi kia chẳng bám vào hư không này
Con nay kính cẩn trình bày
Người nghe chứng giám tỏ bày Tâm Con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_q8pwc_14', '07e84257-d983-4586-8ded-2c116666aca7', 'Nguyện cho người sống vuông tròn
Nhìn ra Tánh Phật cùng con An Lòng
Sống cùng Phật Tánh không mong
Không Tham ảo vọng không lòng sân si', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_jjutf_15', '07e84257-d983-4586-8ded-2c116666aca7', 'Không chi vương vấn người đi
Không chi dính mắc Ý người Chân Như
Lòng này đã tỏ thật hư
Mong người đón lấy sống Như Phật truyền
Pháp này chẳng phải truyền riêng
Người mau cảm thấu lên Thuyền về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.321Z', '2026-06-16T03:08:15.321Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_8hflx_0', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Con cua tám cẳng hai càng
Bò ngang bò dọc chẳng màng đến ai
Chẳng cần biết đúng hay sai
Đụng vào càng cứ kẹp hoài không tha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_8uc6t_1', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Đến khi bị bắt khóc la
Nhốt vào xô rọ biết là khổ đau
Cố bò cố trốn thoát mau
Nhưng đàn cua khác bám sau chân mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_r8ocu_2', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Giờ đây mới rõ sự tình
Khi gặp hoạn nạn tử sinh rõ Bè
Quyết tâm thoát chẳng e dè
Dù bao khổ nạn khóc nhè ích chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_6jzgb_3', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Thoát Xô cua ráng bước đi
Vô tri vô giác nghĩ là thoát thân
Ngờ đâu cua vẫn cứ đần
Bò vào nồi lẩu bị mần thịt luôn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_1qymt_4', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Thương thay số kiếp con Cua
Vươn càng ngang ngược hơn thua với đời
Đến khi gặp cảnh thất thời
Cua kia cũng phải dứt hơi lên bàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_9xnh9_5', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Muốn cho thấy được rõ đàng
Càng tinh càng tấn phải càng tỏ minh
Nếu không Cua chính như mình
Bò ngang bò dọc rớt uỳnh nước sôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_9jyco_6', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Muốn không gặp cảnh lăn trôi
Tặng người hữu phúc chữ "Thôi" Phật truyền
Thôi vọng thôi ngã thôi điên
Nhận ra Tự Tánh là yên muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_nvhk6_7', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Ai ơi đang sống ở đời
Thấy nghe nói biết thảnh thơi ngay mình
Vừa luôn tinh tấn vừa minh
Hành ngay Tự Tánh tử sinh không màng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_g0sx7_8', 'e4a52c22-926f-49ca-910f-68282c5a7200', 'Sống luôn tỉnh thức rõ ràng
Muôn thời người bước trên đàng Như Lai
Từ nay thoát cảnh bi ai
Ung dung tự tại về Ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.327Z', '2026-06-16T03:08:15.327Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_187jz_0', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Oai thay thân tướng con Tôm
Toàn thân áo giáp bọc ôm quanh mình
Các chân múa phá tung sình
Đuôi Tôm dũng mãnh thình lình búng xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_avfp8_1', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Râu thì như cái ra đa
Dò ra mọi thứ từ xa đến gần
Mắt Tôm như các vị thần
Trên cao nhìn rõ muôn phần xung quanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_38idj_2', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Trớ trêu nghịch cảnh cho anh
Cớ sao lại chứa thức ăn trên đầu
Thế thì não bộ ở đâu
Đầu toàn cặn bã hỏi sao tỏ tường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_uxklr_3', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Muôn đời Tôm cứ lạc đường
Suốt ngày mò mẫm dưới mương dưới đầm
Đến khi muốn hết mê lầm
Tôm thời tìm cách thoát đầm bùn nhơ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_kl3tc_4', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Liều thân Tôm cố lên bờ
Biết mình mắc cạn nhảy đơ cả người
Xung quanh gặp kẻ đang cười
Hôm nay lại có Tôm tươi ăn rồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_080j1_5', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Tôm ơi muốn hết thành mồi
Đừng ôm bùn bẩn vào đầu mà chi
Nhận ra chỗ bất tư nghì
Gặp bao cám dỗ đừng ghi vào đầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tvhj6_6', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Sống sao đối cảnh chẳng thâu
Ở yên Tự Tánh rõ màu an yên
Đến khi thân mạn hết duyên
Buông đi mọi thứ Tôm liền hoá Long', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tj12n_7', '8d47f06e-cd52-4425-9d4e-1c15c58c322e', 'Vũ Môn Tôm vượt hóa Rồng
Toàn thân kim giáp vàng đồng lung linh
Mắt râu thấu rõ sự tình
Tuỳ duyên hoá độ quần sinh cõi trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.332Z', '2026-06-16T03:08:15.332Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_zfn3n_0', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Đũa kia sao lại có đôi
Khi cầm một chiếc gắp đồ được chăng
Đũa kia sao lại thẳng băng
Khi mà cong quẹo gắp ăn thế nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_rgb0w_1', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Đũa kia khi đọc ra sao
Đua cùng với Ngã thế nào ai ơi
Đũa gieo vay trả ở đời
Hơn thua trả Đũa hỏi thời an không', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_jnsq8_2', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Bao năm bao kiếp lông bông
Phân biệt dính mắc mãi không an lòng
Âm dương cuốn hút xoay vòng
So đo tính toán sao mong thoát trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_q8uz4_3', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Cuốn theo quy luật xoay vần
Sanh bao ma tánh sao lần lối ra
Ở trong cõi Tạm Ta Bà
Cố tìm lối thoát về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_76m7f_4', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Nhưng toàn gặp cảnh bi ai
Ganh đua trả đũa diễn hoài nơi đây
Tham Sân Si ngã mỗi ngày
Làm sao thoát cảnh đọa đày sáu phương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_7k9m0_5', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Ai ơi muốn thấy rõ đường
Nhìn ra Tự Tánh tỏ tường thực hư
Đại duyên Vô tặng chữ “Như”
Thấy Nghe Nói Biết rõ Chư Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_dsvqa_6', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Chẳng lo nhân quả Ta Bà
Hành không dính mắc hỏi thời quả chi
Người mau nhận lấy không nghi
Không còn nhị kiến thị phi cõi trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_o6a0t_7', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Từ nay hết tưởng hết đần
Dạo hành Công Đức tích phần về Quê
Từ nay hết vọng hết mê
Không theo ma tánh liền về Nhà Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_tb42l_8', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Người ơi đừng ngại sớm trưa
Đừng ngại cái ấy đừng ưa cái này
Sống luôn diệu dụng mỗi ngày
Hành không dính mắc thoát lầy thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_x11iw_9', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Từ nay người mãi an nhàn
Sống luôn ngay thẳng hằng an muôn thời
Từ nay người sống ở đời
An nhiên tự tại về nơi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_chlfc_10', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Nguyện cho nhân thế Ta Bà
Liễu chuyện đôi đũa về Nhà mình ngay
Nguyện cho đại chúng cõi này
Luôn hành tinh tấn sớm ngày Đạo Viên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162356_p9qg1_11', 'a8e4652b-c6c8-4d65-8c8e-54c1f0d62539', 'Ai nhận được Ý đại duyên
Bồ đề tâm phát lên thuyền Như Lai
Không còn gặp cảnh bi ai
Thường lạc ngã tịnh mãi hoài an nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.338Z', '2026-06-16T03:08:15.338Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_9n1bn_0', '5212bb30-ae19-4625-81e9-50e31d05813b', 'Bao năm lận đận lao đao
Lao tâm khổ trí tìm vào Như Lai
Nhưng toàn gặp cảnh bi ai
Đưa người lẩn quẩn đi hoài không ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_pc1c4_1', '5212bb30-ae19-4625-81e9-50e31d05813b', 'Gặp toàn hạn quỷ hạn ma
Làm người rối trí lạc nhà Chân Như
Hữu duyên gặp được Tam Vô
Nhưng lòng người vẫn hình như chắc là', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_9syki_2', '5212bb30-ae19-4625-81e9-50e31d05813b', 'Đến khi nghe giảng thế là
Tâm người khai tỏ thấy nhà mình ngay
Nỗi niềm tìm kiếm lâu nay
Như ong vỡ tổ mắt cay lệ oà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ev2cd_3', '5212bb30-ae19-4625-81e9-50e31d05813b', 'Khóc mừng như trẻ lên ba
Cầu xin Ta dạy người về Nhà Xưa
Ta thời không ngại nắng mưa
Chỉ cần người có Tín Tâm được liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_la9zl_4', '5212bb30-ae19-4625-81e9-50e31d05813b', 'Sống trong thể Tánh thường xuyên
Muôn thời người được an yên thanh bình
Tánh người vốn sẵn lặng thinh
An nhiên tự tại biết mình là ai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.343Z', '2026-06-16T03:08:15.343Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_zq903_0', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Sinh ra ở cõi Ta Bà
Vì danh vì lợi thế là cầu mong
Đến chùa lạy lục đợi trông
Tài lộc xin mãi vẫn không thấy gì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_8vhnu_1', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Thế là Đình - Miếu cứ đi
Dâng mâm dâng lễ cầu chi hỡi người
Đến Đình đến Miếu thì tươi
Về nhà rủ rượi rõ người vô minh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_lissa_2', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Gia đình cứ mãi lình xình
Hơn thua cãi vã không nhìn mặt nhau
Sân si uất hận từ đâu
Phải chăng tự rước Bọn Sâu về nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_qy9fj_3', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Xong rồi cầu chỗ Thầy Bà
Mong trục được đám Sâu mà tự mang
Nhưng hoài chẳng thấy an nhàn
Gia đình vẫn cứ ngày càng tan hoang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_5k9y5_4', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Mỗi ngày gia cảnh càng toang
Làm sao để được con ngoan gia hoà
Người ơi đừng để mù loà
Thành tâm hướng Phật về toà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_czt9e_5', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'Ngọc Châu không của riêng ai
Ngay mình sẵn có kiếm hoài nơi đâu
Không tìm không kiếm không cầu
Về ngay Tự Tánh thoát sầu lạc trôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_s3czn_6', '01b59b23-890d-4ea9-85e6-8b18fdcc4ff1', 'An nhiên tự tại đây rồi
Không cần tìm kiếm xa xôi nơi nào
Gia đình vui vẻ bên nhau
Thường Lạc Ngã Tịnh là màu hằng an
Đại duyên Vô chỉ rõ đàng
Luôn hành Tự Tánh an nhàn tại gia', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.348Z', '2026-06-16T03:08:15.348Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_a4zcg_0', 'fab8db39-3ce7-4562-beda-b5c4878d2600', 'Lành thay con trẻ biết Nhà
Tỏ lòng cảm niệm Phật Đà dẫn đưa
Các con chẳng ngại sớm trưa
Thường hành Tự Tánh không ưa huyển trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.354Z', '2026-06-16T03:08:15.354Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_m03u2_1', 'fab8db39-3ce7-4562-beda-b5c4878d2600', 'Dù bao ảo vọng xa gần
Con ơi tỉnh thức muôn phần chớ va
Đại duyên Ta dẫn về Nhà
Nguyện cho con trẻ Ngự Tòa Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.354Z', '2026-06-16T03:08:15.354Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_xavnk_0', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Nhân sinh khắp chốn hồng trần
Vô minh chấp niệm chẳng cần thoát ra
Cho rằng trong cõi Ta Ba
Buồn vui sướng khổ mới là đời hay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_iiipb_1', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Thuận thời thì gặp cảnh may
Vô tư vui vẻ sa lầy tấm thân
Đến khi phước báu hết dần
Khổ đau kéo đến lạy thần cứu con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_p7n5w_2', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Trôi lăn lục đạo lối mòn
Thất tình lục dục trói con muôn đời
Muốn không gặp cảnh rối bời
Đạo nhân vô chứng tức thời tìm ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_lowrp_3', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Dù cho thân xác hao gầy
Cũng luôn tha thiết tìm thầy dẫn đưa
Không ngại sóng gió nắng mưa
Một lòng giải thoát đường xưa tìm về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_a0dlg_4', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Đại duyên gặp Đạo thoát mê
Đạo Nhân dẫn lối về quê xưa liền
Muốn theo đường thoát não phiền
Hành ngay Tự Tánh là yên muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_pwqx6_5', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Từ nay người sống ở đời
Thấy nghe nói biết rõ lời Phật trao
Đời người thoát khỏi khổ đau
Sống luôn tỉnh thức sẽ mau về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_6h9ci_6', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Ai ơi đừng có la cà
Như Lai Phật Giới chính là quê xưa
Là nơi không nắng không mưa
Không còn khổ não không ưa hảo trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_zprpk_7', '8abf951e-c2ef-4b71-a28b-f9e33ae1580f', 'Về đây rõ biết Pháp Thân
Không vật không tướng nhiễm bần sao đây
Về đây người đã thoát lầy
Ung dung tự tại ở ngay Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.359Z', '2026-06-16T03:08:15.359Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_x9fpw_0', 'aab80829-f66d-4157-bc76-a68561e6369c', 'Bao nhiêu đời lăn lộn
Mong được thoát bờ mê
Khi trực nhận trân báu
Tỏ rõ chân thật trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.363Z', '2026-06-16T03:08:15.363Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_cr5hf_1', 'aab80829-f66d-4157-bc76-a68561e6369c', 'Lìa bỏ hồng huyên ảo
Liền ở tại tánh như
Thường hành pháp vô trụ
Thoát được vọng nhị nguyên
Quy về nơi bản giác
An nhiên tự tại hành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.363Z', '2026-06-16T03:08:15.363Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_cnbub_0', '58514505-31e9-443f-bf06-3c21488e9849', 'Trôi lăn trong chốn trần lao
Hao tâm khổ trí biết ngày nào ra
Ở trong cõi tạm Ta Bà
Phật đâu chẳng thấy gặp Ma thì đầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_gxk33_1', '58514505-31e9-443f-bf06-3c21488e9849', 'Trãi qua khổ não mỗi ngày
Mong qua kiếp nạn thoát lầy thế gian
Mỗi lần gặp cảnh gian nan
Đều là bài học rõ đàng mà đi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ipo9n_2', '58514505-31e9-443f-bf06-3c21488e9849', 'Người ơi hãy thử tư duy
Càng gặp nạn mãi càng đi lòng vòng
Đời người chưa được tỏ thông
Dứt lìa hơi thở hết mong về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_rpr2l_3', '58514505-31e9-443f-bf06-3c21488e9849', 'Muốn cho hết bị la cà
Luôn hành Tự Tánh thế là tỏ thông
Đời người hết bị lông bông
Thấy nghe nói biết hành không gặp phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_n559i_4', '58514505-31e9-443f-bf06-3c21488e9849', 'Từ nay người mãi an yên
Bao nhiêu khổ nạn sẽ liền rời xa
Đời người sẽ hết vọng va
Ung dung tự tại về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.368Z', '2026-06-16T03:08:15.368Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_xt2go_0', 'e75ebcc3-d6ff-413a-ae82-5f7d3ca4ab96', 'Con Huệ Quang xin trình kệ cúng dường Sư Cha Tam Vô 🙏🙏🙏
Đại đức công dày được gặp Cha
Sư con tôn kính cõi ta bà
Người mang chánh pháp kinh Vô Tự', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.372Z', '2026-06-16T03:08:15.372Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_971eg_1', 'e75ebcc3-d6ff-413a-ae82-5f7d3ca4ab96', 'Độ hóa muôn người thoát vọng Ma
Chỉ rõ lìa tâm quy Bổn Tánh
Hóa độ quần sanh thấy Quê Nhà
Hào quang chiếu rọi ngàn tăm tối', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.372Z', '2026-06-16T03:08:15.372Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_4defi_2', 'e75ebcc3-d6ff-413a-ae82-5f7d3ca4ab96', 'Dẫn lối con nay rõ Phật Đà
Nguyễn Đức Doanh-Huệ Quang 8/3/2023
Nam mô Tam Vô Đạo Sư 🙏🙏🙏
Con nguyện ứng thể của Cha mãi  khỏe mạnh để dẫn dắt chúng con trên con đường Giác ngộ giải thoát!', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.372Z', '2026-06-16T03:08:15.372Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_kozkt_0', '6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Con Huệ Quang xin trình kệ cúng dường Sư Cha Tam Vô 🙏🙏🙏
Cõi tạm ta bà cứ mẩn mê
Ngàn năm Đức  Phật vẽ cho về
Nhưng vì đắm dục lầm hoang lối', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_jtn5d_1', '6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Ngũ ấm Ba Tuần xỏ mũi Bê
Hướng ngoại tuông chừng ba thứ độc
Này thân chẳng rõ cội Bồ Đề
Chìm trong Lục Đạo vui buồn khổ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_a9nea_2', '6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Sẽ chẳng bao giờ thấy được Quê.
Phúc thịnh duyên lành gặp được Cha
Thiện người trí thức tỏ thông Nhà
Gieo mầm giải thoát vòng Tam Giới', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_y0j0k_3', '6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Bổn Tánh quay về bỏ chứng Ma
Nhận Bảo Châu mình Cha chỉ rõ
Tâm gầy thổn thức giọt châu òa
Giờ con đã biết Pháp thân tịnh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_j7jk9_4', '6300b881-aa2a-47d3-803f-0d6abc2031bd', 'Cảm Niệm Ân Người đã độ tha.
Nguyễn Đức Doanh-Huệ Quang  13/3/2023
Nam mô Tam Vô Ân Sư🙏🙏🙏', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.376Z', '2026-06-16T03:08:15.376Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_factw_0', '9c939dc6-197d-4013-975f-eb005e00432e', 'Con Huệ Quang xin trình kệ cúng dường Sư Cha Tam Vô!🙏🙏🙏
Cha khai ánh sáng tỏ đời con
Cha dẫm chân qua những nẻo tròn
Cha quản công dày ươm hạt bể', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.381Z', '2026-06-16T03:08:15.381Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_jtmhu_1', '9c939dc6-197d-4013-975f-eb005e00432e', 'Cha gieo Bồ Đề ủ mầm non
Cha hằng giảng đạo không màng nghỉ
Cha mãi khuyên người sống phải son
Cha dạy con dừng buông dứt hết
Cha cười Thắm dạ cả lòng con
Nguyễn Đức Doanh-Huệ Quang 6/3/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.381Z', '2026-06-16T03:08:15.381Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_hfjwm_0', 'd6205cf8-9cda-451b-9b99-149d44a79f0d', 'Hạnh phúc nào có đâu xa
An nhiên tự tại ngay Nhà mình thôi
Có gì mà kiếm xa xôi
Tiền tài danh lợi là nôi não phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.385Z', '2026-06-16T03:08:15.385Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_mht36_1', 'd6205cf8-9cda-451b-9b99-149d44a79f0d', 'Còn tìm còn kiếm đều điên
Buông đi vọng tưởng tự yên ngay mình
Gia đình tự khắc an minh
Cửu huyền thất tổ tự mình thoát ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.385Z', '2026-06-16T03:08:15.385Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_fg2or_2', 'd6205cf8-9cda-451b-9b99-149d44a79f0d', 'Nguyện cho người rõ Quê Nhà
Dẫn đàn con nhỏ lìa Ma ngay mình
Tham sân si ngã bất sinh
Cả nhà người sẽ hằng minh an nhàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.385Z', '2026-06-16T03:08:15.385Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ji27d_0', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Tìm đâu để thấy chữ An
Tìm đâu đến chỗ an nhàn thảnh thơi
Đời người chỉ có một hơi
Đến khi lìa dứt một đời đã qua', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_cjevz_1', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Làm sao để sống hiền hoà
Làm sao an lạc nơi tòa Như Lai
Làm sao thoát cảnh bi ai
Làm sao ở cảnh mãi hoài an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_rzs0h_2', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Sống sao hạnh phúc an nhiên
Sống sao mọi thứ ưu phiền tránh xa
Sống sao để trở về Nhà
Sống sao đối cảnh huyển mà vẫn An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_jy39k_3', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Muốn luôn mãi được an nhàn
Muốn luôn tự tại trên đàng về Quê
Muốn luôn thoát cảnh rừng mê
Muốn luôn an lạc tại Quê Xưa mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_wumei_4', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Tìm nơi bất tử bất sinh
Nhận ra chốn ấy nơi mình hằng an
Tìm ra Tự Tánh rõ ràng
Thường hành nơi ấy chính đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_vrf00_5', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Sống luôn chân thật không sai
Không vọng không tưởng không xài luận nghi
Sống trong chỗ bất tư nghì
Luôn hành Tự Tánh tự đi về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_7kjxj_6', 'c3caea77-3d67-4512-981a-296e2985f9e0', 'Từ nay người hết la cà
Ở quê hương cũ mãi là Tịnh Thanh
Từ nay hết bị loanh quanh
An nhiên tự tại Vô Sanh rõ đường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.391Z', '2026-06-16T03:08:15.391Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_bwyg7_0', '009b16d6-e843-4841-abc7-a5690a829abb', 'Sống trong ảo cảnh trần gian
Mọi người dính chặt muôn ngàn lợi danh
Bao năm tìm kiếm đua tranh
Có nhiều của cải gọi là giàu sang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.395Z', '2026-06-16T03:08:15.395Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_u6nvd_1', '009b16d6-e843-4841-abc7-a5690a829abb', 'Nào ngờ nhiều cảnh trái ngang
Tài vật danh lợi cản đàng Vô Sanh
Nhận lầm rồi chạy loanh quanh
Người ơi nên biết Tịnh Thanh ngay mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.395Z', '2026-06-16T03:08:15.395Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_2e7nj_2', '009b16d6-e843-4841-abc7-a5690a829abb', 'Quay về Bản Thể lặng thinh
Gặp ngay Ngọc Quý chẳng gì sánh ngang
Sống trong chỗ ấy an nhàn
Chẳng ham tài vật hay ngàn lợi danh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.395Z', '2026-06-16T03:08:15.395Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_gt1g6_3', '009b16d6-e843-4841-abc7-a5690a829abb', 'Người Giàu biết Đủ không tranh
Không tìm không kiếm loanh quanh bên ngoài
Giúp cho nhân thế muôn loài
Muôn nhà hạnh phúc không đòi hỏi chi
An yên chỗ Bất Tư Nghì
Ung dung tự tại không gì vướng tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.395Z', '2026-06-16T03:08:15.395Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_84g4c_0', '411045ae-1663-4fa6-ba51-eb5f0019fa57', 'Lành thay con trẻ tỏ lòng
Nhớ ơn khai thị thoát vòng trầm luân
Duyên ngày Báo Hiếu trần gian
Các con các cháu về làng quê Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.401Z', '2026-06-16T03:08:15.401Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_y09md_1', '411045ae-1663-4fa6-ba51-eb5f0019fa57', 'Không còn rối rắm Ta Bà
Cả nhà ấm áp bên Cha sum vầy
Nguyện cho con trẻ mỗi ngày
Luôn luôn tỉnh thức hằng giây hằng giờ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.401Z', '2026-06-16T03:08:15.401Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_jqe3g_2', '411045ae-1663-4fa6-ba51-eb5f0019fa57', 'Nguyện cho con thoát mê mờ
Luôn hành Tự Tánh về bờ an nhiên
Nguyện cho con hết đảo điên
Ung dung con bước về miền Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.401Z', '2026-06-16T03:08:15.401Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_u2dix_0', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Thế nhân sao thật lạ kỳ
Cùng chung một thể cứ nghi nhau hoài
Trôi lăn bao kiếp mệt nhoài
Luân hồi sáu nẻo chín loài đeo mang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_yaxjj_1', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Nghi sao người có được An
Dính chặt nghi kỵ rồi than trách đời
Tự gieo khổ não muôn thời
Sầu bi phiền muộn sẽ chơi với người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_6xx7c_2', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Nghi chi để mất tiếng cười
Nghi chi để khổ chẳng tươi chút nào
Suốt ngày đầu cứ càu nhàu
Nghi Cha nghi Mẹ vợ chồng  cũng nghi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_uhj0e_3', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Nghi Anh nghi Chị nghi Dì
Nghi Em nghi Cháu rồi nghi bạn bè
Nghi từ Cô Chú họ hàng
Nghi ra ngoài ngõ xóm làng gần xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_p15lu_4', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Nghi từ những kẻ gần ta
Nghi ra những kẻ ở xa bên ngoài
Ngày nào người cũng mệt nhoài
Chỉ vì bản Ngã nghi hoài không thôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_wkcq2_5', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Càng nghi người sẽ càng trôi
Quý nhân xuất hiện giúp lôi Vào Bờ
Nhưng tâm người cứ nghi ngờ
Chửi luôn Vị giúp thoát dơ sình lầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_zrshc_6', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Hữu duyên Vô chỉ cách này
Tìm ra Tự Tánh ở ngay nơi mình
Thấy Nghe Nói Biết hằng minh
Suy tư vọng niệm khởi sinh Buông liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_09upf_7', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Đời người mãi được an yên
Hành nơi Tự Tánh người liền về Quê
Đến nơi không vọng không mê
Không nghi không tưởng không chê không phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_tyodr_8', '847741d2-7b77-432e-a057-3373e79d5a1f', 'Từ nay hết đảo hết điên
Hành không dính mắc an nhiên muôn thời
Đại duyên Vô có mấy lời
Ai duyên nhận được đến nơi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.405Z', '2026-06-16T03:08:15.405Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_s4xat_0', '6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Một mình ngồi ngắm trăng thanh
Ánh trăng soi sáng xóa tan đêm dài
Trăng soi chẳng quảng mệt nhoài
Dù đêm u tối trăng hoài chiếu soi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_e29ux_1', '6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Trớ trêu mây thích tìm tòi
Bồng bềnh trôi nổi che mờ ánh trăng
Lại thêm cơn gió lăng xăng
Đưa mây khắp chốn trôi lăn liên hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_7757x_2', '6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Khi mây che ánh trăng rồi
Gió liền kéo đến rủ mời mây đi
Mây đi trăng sáng diệu kỳ
Mây liền được gió đưa về che trăng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_5nijn_3', '6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Dù cho mây gió lăng xăng
Cứ hay đùa cợt nhưng trăng chẳng màng
Trăng luôn soi sáng rõ ràng
Ai duyên được sáng tỏ đàng trong đêm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_bu3dl_4', '6eda0937-75c5-4ed4-8ec3-f79cb2d7a3ea', 'Vững vàng người bước êm đềm
Quê xưa người rõ màn đêm không còn
Duyên nay ngồi ngắm trăng tròn
Nguyện cho đại chúng không còn lạc trôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.412Z', '2026-06-16T03:08:15.412Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ewbv7_0', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Lạc trôi vào chốn rừng sâu
Bảy ngày đói khát khổ sầu thân tâm
Càng đi càng thấy mê lầm
Mong tìm lối thoát khỏi rừng U Minh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_8pne1_1', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Hữu duyên gặp Lão đầy sình
Toàn thân ghẻ lỡ quanh mình ghớm ghê
Lão thân bệnh tật đề huề
Tay cầm đu đủ thảm thê một mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_cslor_2', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Người liền bày tỏ sự tình
Lão cho đu đủ cứu người được no
Nhưng người vẫn thấy âu lo
Lão liền chỉ lối giúp cho thoát rừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_eyxp2_3', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Nhưng người cứ mãi lừng khừng
Nghi ngờ Ông Lão biết đường thật không
Vì Ông vẫn ở rừng chông
Nghi Ông biết lối sao không ra rừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_miyjp_4', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Rồi người chửi Lão không ngừng
Rồi chê Ông Lão rồi cười Ông dơ
Chê Ông ghẻ lở như tơ
Chê Ông bệnh tật bơ vơ một mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_xnej3_5', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Tự người đánh mất niềm tin
Lại tự mò mẫm tự tìm lăng xăng
Thế là người cứ trôi lăn
U mê tăm tối lại ăn khổ sầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_f4af4_6', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Người ơi muốn hết đau đầu
Nghe lời Ông Lão đừng thâu nghi ngờ
Người ơi muốn hết mê mờ
Nghe lời Ông Lão rừng mơ thoát liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_0zufp_7', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Rõ Ông chẳng có ưu phiền
Dù cho bệnh tật an nhiên một mình
Rõ Ông Đức Hạnh Hằng Minh
Cho đi tất cả chẳng sinh mong cầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_x76te_8', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Rõ Ông chẳng có ưu sầu
Dù thân ghẻ lở vẫn đâu than gì
Rõ Ông biết rõ đường đi
Chỉ người lối thoát Rừng Si mê mờ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_q3rw2_9', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Người ơi đừng có chần chờ
Hành theo Ông Lão Rừng Mơ không còn
Đến nơi cảnh trí Viên Tròn
An nhiên người bước lối mòn Về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_34quc_10', '5087eaca-ed18-49fe-8bf2-02e0ee98048f', 'Từ nay hết vọng hết mê
Ung dung người bước đường về Nhà Xưa
Đến nơi chẳng có nắng mưa
Lại gặp Ông Lão dẫn đưa hôm nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.421Z', '2026-06-16T03:08:15.421Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ct21q_0', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Con chi sao thật lạ kỳ
Chân Ngựa tay Khỉ đầu thì như Tôm
Thân như vỏ Ốc cứ ôm
Nhưng hay uống éo như Lươn trong đầm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_kokip_1', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Mũi như lũ Chuột trong hầm
Mắt như lũ Sói âm thầm rừng sâu
Tai thì như Thỏ lo âu
Miệng rộng như Rắn lúc ăn con mồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_41054_2', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Sống như Lợn thích nằm ngồi
Tiếng kêu như Ếch lúc trời đổ mưa
Đuôi như Bọ Cạp nhọn đưa
Bụng đầy tơ Nhện cứ ưa bắt mồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_e4poy_3', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Sừng Trâu mọc ở trên đầu
Răng nanh vuốt Hổ sẵn sàng tấn công
Da đen lại giống Nhím lông
Dáng đi ngơ ngác giống như Lạc Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_2dan4_4', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Con Chi ở chốn Ta Bà
Hàng trăm tỷ kiếp mãi mà chẳng ra
Nó luôn lảng vảng bên ta
Ai mà không thấy thành Ma chín loài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_us8to_5', '29063742-bc44-4137-bb75-7e1fd0f4217d', 'Ai duyên thấy rõ nó rồi
DỨT duyên vọng khởi sẽ rời nó ra
Người liền ở chốn Phật Đà
An nhiên người bước về Nhà Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.428Z', '2026-06-16T03:08:15.428Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_edvwq_0', '458d01a0-7da6-4a9e-9308-a9ba1b93ebf7', 'Vạn sự hành Nhẫn nén sân si
Đến khi tức nước vỡ cảnh gì
Tùy duyên đối cảnh vô tâm khởi
Vô nhiễm Vô Nhẫn hoài thảnh thơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.433Z', '2026-06-16T03:08:15.433Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_013hy_0', 'cd62edba-ce53-4790-83be-7619c4db5b21', 'Trường Giang Triều Đại Loạn Phong Ba
Thủ Phất Thuỷ Ly Thoát Ta Bà
Bản Lai Vô Vật Gia Hương Cố
Hồng Trần Há Nhiễm Chốn Tam Vô', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.439Z', '2026-06-16T03:08:15.439Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_ndt5a_0', '4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Tuệ Tri ở Thái Nguyên trình kệ cảm niệm Ân Sư Cha Tam Vô
Buổi đầu gặp Cha trên sóng
Vẫn nâng niu Cha cởi trói giúp con
Lời lân mẫn ân cần sâu sắc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_93fb8_1', '4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Con đói lắm nhưng không dám thưa Cha
Cơm sẵn đây sao các con e ngại
Cha vì các con mà ban tặng ngọc ngà
Thương đàn con bao kiếp đợi chờ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_nfk68_2', '4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Cha hỡi Cha chúng con rơi nước mắt
Vì hôm nay con đã đổi đời
Không còn cảnh bon chen dành danh lợi
Cũng chẳng thấy còn cố chấp phần hơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_i6zpn_3', '4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Mặc ngoài kia cảnh đời như chim cắt
Nay có Cha rồi con đâu sợ trắng đen
Quyết đời này bỏ đi kiếp tái sinh
Quên nhà lửa bước chân lên ĐẠI GIÁC', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_qttz0_4', '4aeb5434-1018-49d6-b6c9-584d06f5d23e', 'Mới bõ công Cha ban phát kinh này
Nguyện một lòng chúng con không lùi bước
Thắp sáng trong con trí tuệ này
Con xin ngàn lần cảm niệm Ân Sư Cha
Hằng Tịnh  18/01/2023', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.445Z', '2026-06-16T03:08:15.445Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_2gg6x_0', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Hằng Tịnh ở Thái Nguyên trình Kệ cúng dường Sư Cha Tam Vô
Một lòng con quyết tìm Cha
Phải chăng bao kiếp không nhà lang thang
Đập va đau đớn ê chề', 'Hướng Về Khắp Tất Cả', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_pef8e_1', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Mà nay cập bến thuyền về bên sông
Cho dù bao kiếp ngóng trông
Thuyền về bến đỗ lòng không rối bời
Nhìn Cha con khóc thành lời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_i41z1_2', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Nấc lên hạnh phúc bao đời đợi mong
Thưa Cha con  dứt long đong
Nhà đây Cha đấy còn mong cầu gì
Nghẹn ngào như trẻ gặp Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_n111g_3', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Chỉ nhìn đã thấy Cha trao NGỌC rồi
Vậy sao bao kiếp luân hồi
Tìm Cha lăn lộn đứng ngồi không yên
Nay Cha cho chữ bình yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_uhc5u_4', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Con dang tay nhận an nhiên ùa về
Mặc cho thời thế đảo điên
Có Cha khai sáng con liền nhận ra
Tất cả đâu có của ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_zbmca_5', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Tự tâm tham chấp rồi va vào mình
Từ khi Cha Mẹ sinh ra
Pháp thân chẳng nhận cứ tham xác này
Để nhằm đau đớn khổ thây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_3xl3c_6', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Từ nay con rõ chính con không phàm
Ở trong tự tánh không tham
Sinh ra tiếng khóc khổ cho kiếp người
Gặp Cha con khóc thay lời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_gtjyf_7', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Mười phương CHƯ PHẬT chính người đã trao
Cha thương con sống lao đao
Rồi trao NGỌC quý cho con thêm giàu
Từ nay con hết khổ đau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_4yrm5_8', '5ba4fd10-8cae-44cb-a93c-599f8d375f35', 'Có Cha trao NGỌC ngàn đời mang theo
Cha ơi sâu nặng tiếng Cha
Gọi Cha :là nước mắt rơi nhạt nhòa
Từ nay con đã về Nhà
Có Cha huynh đệ rõ là PHÁP THÂN
Hằng Tịnh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.452Z', '2026-06-16T03:08:15.452Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162357_uumcd_0', '94a5362b-aa28-47ea-a819-0bda8e3f5d2f', 'Lâm Thanh Thiên Hoả Vân Huyền Ảo
Chúng Sanh Mê Đắm Xứ Trần Lao
Ngao Du Khai Đạo Xuyên Tam Giới
Dẫn Độ Quần Sanh Đáo Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.457Z', '2026-06-16T03:08:15.457Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ho7fp_0', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Trôi lăn bao kiếp bể dâu
Giờ đây không nhớ nơi đâu là Nhà
Lang thang trong cõi Ta Bà
Sanh già bệnh chết mãi mà không ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_cy5du_1', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Muôn đời ở tạm cõi Mơ
Ngỡ rằng Nhà của mình giờ là đây
Ngờ đâu vòng lập luôn xoay
Thường xuyên trói buộc bằng dây điện từ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_5847j_2', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Nhà này ở mãi mệt đừ
Tham sân si mãi mà cư trú hoài
Trôi lăn sinh tử chín loài
Làm sao để thoát ra ngoài Nhà Mơ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_2v1j9_3', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Ai mong thoát cảnh ngu ngơ
Nhất tâm tha thiết tìm ra chính mình
Tìm Vị giúp thoát tử sinh
Tìm ra Nhà của chính mình từ xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_js5rv_4', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Duyên được khai thị Phật thừa
Nhận ra bản thể hết ưu luân hồi
Ai duyên ngộ bổn tánh rồi
Hành không dính mắc về ngôi Nhà liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_64fii_5', '6bf5b087-f024-4fbc-9de6-14876d61f669', 'Về Nhà người hết ưu phiền
Hết trôi hết lặn hết điên hết khùng
Ai duyên thoát khỏi Nhà Bùn
An nhiên người đến Nhà Vàng Liên Hoa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.461Z', '2026-06-16T03:08:15.461Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_w3ntw_0', '3c2ca326-4fcc-47ef-9e74-6c1980b446b7', 'Lâm Thanh U Hiện Diệu Liên Hương
Hoa Khai Soi Chiếu Khắp Thập Phương
Tam Kim Quang Tỏa Vô Lượng Xứ
Hữu Duyên Dạo Lộ Cố Gia Thường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.465Z', '2026-06-16T03:08:15.465Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_rk5g9_0', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Đồng Tiền là cái chi chi
Mà sao người cứ mãi đi kiếm tìm
Không Tiền xấu hổ lặng im
Có Tiền hống hách ngông nghênh với đời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_z9vkw_1', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền buồn bã chơi vơi
Có Tiền vui vẻ ăn chơi đua đòi
Không Tiền kham khổ mệt nhoài
Có Tiền sướng chẳng đoái hoài đến ai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9ozyq_2', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền than ngắn thở dài
Có Tiền lớn tiếng không hề nể nang
Không Tiền mơ cảnh giàu sang
Có Tiền chê cảnh cơ hàn năm xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_136n0_3', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền tìm cách lọc lừa
Có Tiền sợ mất sớm trưa giữ gìn
Không Tiền không thể tự tin
Có Tiền khinh rẻ chẳng nhìn người thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_qh2zq_4', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chán nản thất thần
Có Tiền khoái chí sống đần như cua
Không Tiền có đúng cũng thua
Có Tiền dù lỗi vẫn mua lòng người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_4k56c_5', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền được giúp thì tươi
Có Tiền keo kiệt còn lười chảy thây
Không Tiền oán trách suốt ngày
Có Tiền buông thả sống lầy với nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_uq3b4_6', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chỉ thấy khổ đau
Có Tiền tận hưởng cảnh giàu sướng thân
Không Tiền cầu cứu Quý nhân
Có Tiền quên mất chữ Ân chữ Tình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_x4mkx_7', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền nhớ cha mẹ mình
Có Tiền hoang phí quên nhìn mẹ cha
Không Tiền vay mượn khắp nơi
Có Tiền quên mất nợ đời vay ai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_zygnr_8', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Vì Tiền người mãi sống Sai
Không Tiền hay có vẫn hoài ngu si
Tiền kia thì có lỗi chi
Tự mình sai trái trách gì Tiền nong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_bf2j0_9', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Nay duyên Vô tặng chữ KHÔNG
KHÔNG tham KHÔNG muốn KHÔNG mong KHÔNG cầu
Tặng thêm chữ TÚC đứng đầu
Sống luôn biết đủ hết sầu hết than', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ohuvz_10', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Hành liền người sẽ mãi an
Không Tiền hay có cũng nhàn mọi nơi
Đời người chỉ có một hơi
Đừng vì tiền của để đời chênh vênh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_3dvq3_11', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền mình vẫn vui lên
Có Tiền nhưng chẳng ngông nghênh với đời
Không Tiền nhưng vẫn thảnh thơi
Có Tiền cũng chẳng ăn chơi đua đòi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_4c8z8_12', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chẳng thấy mệt nhoài
Có Tiền đồng cảm với người thiếu an
Không Tiền cũng chẳng thở than
Có Tiền nên sống nể nang muôn người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_1clpf_13', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chẳng vọng sang giàu
Có Tiền càng quý cảnh nghèo năm xưa
Không Tiền chẳng vướng lọc lừa
Có Tiền cũng chẳng sợ người lấy đi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_6ubds_14', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền không sống tự ti
Có Tiền tôn trọng những gì xung quanh
Không Tiền nhưng sống tịnh thanh
Có Tiền khiêm tốn để dành giúp nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_1xfza_15', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền cũng chẳng hơn thua
Có Tiền dù lỗi chẳng mua lòng người
Không Tiền nhưng mãi tươi cười
Có Tiền phóng khoáng giúp người thật tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_mc11m_16', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chẳng trách bản thân
Có Tiền nên sống góp phần lợi tha
Không Tiền nhưng chẳng khóc la
Có Tiền chẳng hưởng thụ mà sướng thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_cmpql_17', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chẳng dính chẳng bần
Có Tiền càng quý chữ Ân chữ Tình
Không Tiền hiếu kính người sinh
Có Tiền càng kính ân tình mẹ cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_d43fl_18', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Không Tiền chẳng nợ ta bà
Có Tiền giúp đỡ chẳng cần trả ơn
Không Tiền đức hạnh luôn chơn
Có Tiền giúp được nhanh hơn về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_kwgrs_19', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Ai ơi đang mãi la cà
Đừng vì Tiền Bạc mãi mà lông bông
Nhớ lại Vô tặng chữ KHÔNG
Không tham Không muốn Không mong Không cầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_o7qg7_20', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Hành ngay chữ Túc đứng đầu
Sống luôn biết đủ mãi màu an nhiên
Duyên nay người hỏi chữ TIỀN
Vài lời nhắn gửi giúp phiền lìa nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_u2sqe_21', '1265b634-f912-4c50-85e8-55c4a0a7d8b5', 'Hành ngay Tự Tánh hết bần
Thấy nghe nói biết chẳng cần dính chi
Từ nay thoát cảnh sầu bi
Không Tiền hay Có vẫn đi Phật Đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.472Z', '2026-06-16T03:08:15.472Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_0woja_0', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Bao năm lang bạc phong ba
Nhân nghĩa trí tín nghĩ là chân như
Đến khi nhận được mấy từ
Tổ khai thấy rõ bổn Như ngay mình', 'Nam Mô Giáo Chủ Ta Bà Bổn Sư Thích Ca Mâu Ni Phật
Nam Mô Tổ Điều Ngự Đàm Hoa Chân Thật', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_2bnr4_1', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Thấu triệt vạn pháp diệt sinh
Thấy nghe nói biết rõ minh muôn thời
Thức tỉnh Bổn Mệnh ngàn đời
Dẫn đưa con cháu ham chơi về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_lw278_2', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Thế mà chúng cứ la cà
Chúng mê không chịu thoát ra hồng trần
Dù cho dẫn độ ngàn lần
Chúng đều có lý sống đần ở đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_2fpeb_3', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Tam Vô chẳng muốn làm thầy
Chúng lại cầu khẩn Vô bày cách ra
Đại duyên lại đến Ta Bà
Hiện thân cư sĩ tại gia bình thường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_fmdnn_4', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Tục thân giữ tóc lên đường
Ngao du dạo cảnh vô thường phá mê
Ai mà tha thiết tìm Quê
Buông đi chấp Tướng đường Về Vô khai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_q9efh_5', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Tỷ người chẳng được mấy ai
Nhân duyên nhận được ở ngay Phật Đà
Bao năm tướng tục ba hoa
Đến nay cũng được dăm ba hạt mầm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_lvr7b_6', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Bao năm phá tướng âm thầm
Duyên nay xuống tóc thuyền câm đưa đò
Vô nguyện cùng Tổ hành Cho
Ai duyên được nhận hết lo luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_nsgy6_7', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Duyên nay Vô tặng chữ THÔI
Thôi vọng Thôi tưởng càng Thôi tham cầu
Hành ngay Tự Tánh là đầu
Sống không dính mắc rõ màu an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_t2w24_8', 'f8b219f5-e015-4b2b-9e01-3d704550c2ed', 'Nay Vô Xuống Tóc đại duyên
Nguyện luôn đội Tổ chèo thuyền chở con
Nguyện cho đại chúng viên tròn
Giác Ngộ Giải Thoát không còn Tử Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.480Z', '2026-06-16T03:08:15.480Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_4nwwn_0', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Trường Đăng Con ở Sài Gòn Kính trình kệ cúng dường Sư Cha Tam Vô
Vì một niệm động lạc hồng trần
Hạ phàm trải nghiệm thú nhân gian
Tưởng đâu rong chơi một vài kiếp', 'Nam mô Điều Ngự Đàm Hoa Chân Thật
Nam mô Tam Vô Chân Sư', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_tmj9a_1', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Nào đâu dính chặt vạn thiên thu
Mù mờ mò mẫm tìm lối thoát
Gặp phải thần thông của đạo tà
Ôi ôi nhiều cái sao vi diệu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_qpp2r_2', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Chỉ cần thấu suốt lý âm dương
Thông được thiên văn tường địa lý
Thấu rõ quá khứ thấy vị lai
Chi phối tư duy nhân sinh khác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_eheq2_3', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Điều khiển vạn vật trong tầm tay
Tưởng rằng chân lý đã tìm thấy
Nhưng sao trong lòng vẫn bất an
Tam độc vẫn thường luôn phát tác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_yrih1_4', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Thiêu đốt tàn lụi cả thân tâm
Ngã mạn từ ấy mà sinh khởi
Huênh hoang tự đắc ngỡ mình hay
Vô minh hành nghiệp mà chẳng biết', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ro41l_5', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Cứ thế dính chặt phải trầm luân
Nay nhận Chánh Pháp Như Lai tạng
Hiểu được vạn vật vốn tánh không
Mọi pháp mọi tướng đều hư ảo', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ifik4_6', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Vô thủy vô chung diệt rồi sanh
Hiểu được thế sự không ham muốn
Quyết lòng trở về chốn chơn tâm
Nơi ấy xưa nay hằng bất tử', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_0s7jw_7', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Chẳng sanh chẳng diệt chẳng nhiễm trần
Mỗi khi tam độc đương phát tác
Thấy biết rõ ràng chẳng tham gia
Tuy sống trong nó không phải nó', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_a71n2_8', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Thuờng Lạc Ngã Tịnh chốn Pháp Thân
Hành trì tinh tấn tâm an lạc
Ung dung tự tại dạo cảnh Trần
Thế sự vẫn làm không dính mắc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_6ynad_9', '0c84ea88-7ef3-49e6-9ab4-16676c58dfa5', 'Bên trong Phật tánh hiện Kim Thân
Nguyện rằng một mai khi thành đạo
Hữu duyên giải bày độ chúng sanh
Rồi khi hết duyên nơi trần thế
Thoát ra trở về với Phật Đà
TRƯỜNG ĐĂNG', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.488Z', '2026-06-16T03:08:15.488Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_5tkyl_0', '99be5dec-ea1d-4248-b4e4-9db0d7aa8995', 'Bất Độ trình kệ sở ngộ cúng dường Sư Cha Tam Vô
Quay về tự tâm hằng sáng
Thấy nghe nói biết rõ ràng Huệ Tâm
Phật là bản thể Vô Sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.495Z', '2026-06-16T03:08:15.495Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_5lrjv_1', '99be5dec-ea1d-4248-b4e4-9db0d7aa8995', 'Quên mình theo vật phải đành chuyển luân
Phật thường tỏ sáng hằng luôn
Nơi mình sẵn có tìm đâu nhọc nhằn
Lặn lội rừng núi lăng xăng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.495Z', '2026-06-16T03:08:15.495Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_n0spe_2', '99be5dec-ea1d-4248-b4e4-9db0d7aa8995', 'Thoát được mê lầm Phật ở tại tâm
Thấy nghe nói biết không lầm
Vạn vật thay đổi vô tâm an liền
Từ nay con hết ưu phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.495Z', '2026-06-16T03:08:15.495Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_c45ez_3', '99be5dec-ea1d-4248-b4e4-9db0d7aa8995', 'Cũng vì vọng động lặn chìm Phật ta
Từ nay con đã rõ Nhà
Luôn hằng thanh tịnh Phật Đà Quê Xưa
Cảm Niệm Cha đã dẫn đưa
Khai thị con rõ đường xưa về Nhà
Bất Độ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.495Z', '2026-06-16T03:08:15.495Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_fsdlr_0', '9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Minh Châu trình kệ cúng dường Sư Cha Tam Vô
Đạp bước ngông nghênh nơi thế gian
Chìm nổi gian lao vượt tứ hải
Ngạo ngôn thuyết khắp chốn Sơn Hà', 'Nam Mô Tam Vô Ân Sư
Con cảm niệm Ân Sư Cha khai thị!🙏🙏🙏', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_e5qr9_1', '9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Bước nay khập khiễng gối mòn rã
Tìm cầu nơi nao chốn thường tịch
Mê mờ con trẻ bưng bít lối
Lòng từ Như Lai chỉ tích xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_p6a1t_2', '9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Vạch lối con về quê hương ấy
Cảm niệm ân đức Người lao nhọc
Chỉ cho con khờ nay thấu tỏ
Rừng vàng biển bạc là cát bụi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_cqwrf_3', '9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Địa vị luận lý e niệm tưởng
Chính là gieo hai đường ba cõi
Ngay nơi tịch lặng vọng hãy buông
Tùy duyên cảnh trần hành tự tánh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_cs6ui_4', '9ff3d914-6008-4a8d-8a79-56f4eb4e598b', 'Muôn thời tự tại chẳng dính mắc
Nhận diện ma quân phổ khắp nơi
Một bước thong dong thẳng Về Nhà
Minh Châu
25/04/23', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.504Z', '2026-06-16T03:08:15.504Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_jo4w0_0', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Vô lượng ức kiếp chốn kim quang
Nhất niệm lạc trôi sanh tử đàng
Âm dương tứ đại luôn xoay chuyển
Quên mình rồi mãi trú trần gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_qbbim_1', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Quên luôn quê mình vốn hằng an
→ quên quê xưa của mình,là chôn kim quan lúc nào cũng vậy
Quên đi sứ mệnh kim thân đàng
→la gom côgn đức về nàh, thấy nghe biếtt rõ ràng, có 2 kim thân  1 là kim thân 2 là kim gia, ngôi nhà hình thành từ khối điện từ quan có kim thân mơi tự do đi trogn tam giới', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_5vs2k_2', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Quên đi Tự Tánh Nghe Thấy Biết
→ do dt am dương nên làm quên
Quên rồi người cứ mãi lang thang
→', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9sngq_3', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Cai ngục giam giữ trong tam giới
→ tâm trí là thân thứ 2 giam mình trogn này, để cho mượn thân để lòi ra 6 cửa sổ, đê tánh hiẻn lộ, nhơ fthaays nghe biết cai sđầu này mới học  dc, đê thoa mãn cai dục của nó,
Sáu căn mở cửa nhằm khiển chơi
→ 6 cảm thọ sanh ra 2 thưc s( nhị nguyên)', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_yx9aw_4', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Căn trần tiếp xúc sanh nhị thức
Thỏa mãn cảm thọ ái thủ ngay
→ tốt : ái luyến, thích quý thfi nó ái, → thủ ( giữu ) chấp niệm, thoả mãn cảm thọ thì luyến ái, sở hữu nó
Nghiệp quả sanh ra từ nơi đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_te1re_5', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ái → chấp giữ→ nghiệp quả
Luân hồi sanh tử mãi chốn này
Nhân duyên luân chuyển hoài không dứt
→ 12 nhân duyên, cứ xoay hoài vậy, bao giừo mơi thoát dc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_rrnq9_6', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Bao giờ mới thoát khỏi nơi đây
Quy luật tự nhiên vốn thế này
→ thấy vạy lo cho ngừoi khác, muốn ngừo khác ngộ đạo, nhưn đừng lo, ai cũng vậy tự thấy khổ ( nhiều tiền, ít tiền,,,,,) khổ là do thói quen sống ko đúng đắn, chấp niệm, ôm  giữ tham sân si, gặp gì cũng muốn giữu khôgn muốn buông,
Vạn kiếp trôi lăn sẽ đến ngày', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_grzay_7', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→
Thấy mình thống Khổ mãi nơi đây
Vốn do Tập khí vô lượng kiếp
→ biết thí quen là vô lựng kiếp, biét thế đừng lo độ, tự họ tìm cách mới tìm thôi nên gạp toàm thầy tào lao, khi nao tha thiết mới gặp dc đạo ưu việt, tốt nhất.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_abicp_8', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Tự người tìm cách Tập khí Diệt
→
Tha thiết liền rõ Đạo Ưu Việt
Khổ Tập Diệt Đạo tứ đế diệu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_oolc9_9', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→khổ do tâpk khí→ tha thiết→ tìm → 4 sự thật ai cũng trải qua khổ đế, tập đế  diệt đế đạo đế.
Ai ai cũng vậy vọng độ tiêu
Đến khi hành Đạo ngỡ mình Siêu
→ càng học nhiều dễ bị ngã mạng, tưởng mình hơn người khác.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_devju_10', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Sanh ra ngã mạn rồi tự kiêu
Sanh ra bốn tướng nhân phi nhân
→ nhân ( chấp mình là ngừoi, chấp ko phải người ( khác người ), chấp mình như chúng sanh ( chúng sanh sao thành phật ), thọ giả ( cảm thọ) đều là giả ( an lạc buồn sướng khổ) biết nó đều là giả), chỗ như lai là chỗ ko noi dc ko ngôn từ nào nói dc, tơi chỗ đó ko có cảm thọ nào chi phối được mình,
Chúng sanh thọ giả tức tự thiêu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_cbqdh_11', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ ngã mạn lên 4 tướng đè mình , tháy mình có gì rồi là xong (X)
Tiếp theo năm ấm thường phát tác
→ sắc ( dính sắc)--> thọ ( nhận ngay )--. (sanh ra ) tưởng → hành theo cái tưởng dính ngay ma đạo (hành thức )
Sắc thọ tưởng hành sanh thức pháp', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_0ehbi_12', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Đất nước khí lửa luôn che mờ
→ tứ đại, chỉ hiển thị qua 6 căn
Dính vào ma độc lại ôm rác
→ tâts cả độc là ma táh, tham sân si…. ma tánh, ôm thứ đó la foom rác, biết mình đang biết, nó buồn kệ nó chứ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_lc6xv_13', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Cũng bởi đại chúng thường mang vác
→
Ai duyên hỏi đạo ý liền phát
→ khi nào gặp ai tha thiêt Cha mới khai thị', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_nsgzy_14', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Lấy tạm ba thừa hoá thành dụ
→ tiểu trung đại → biến hoá đủ thứ để biến hoá thức tỉnh con cái thành đạo
Tùy duyên đưa lối người hết tu
Bao đời tìm cách thoát lao tù', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_colf9_15', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→đời nào cũng tìm cách thoát , gặp Cha rồi vẫn nghi, me rồi mắt mù rồi có thấy rõ ràng đâu ( ngoại đoạ la đạo ngoài nhưu lai, ko chế đạo người ta )
Gặp toàn ngoại đạo khiến mê mù
Đại duyên kiến tánh rõ đường thoát
Bản lai vô vật chẳng cần tu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_v5u6b_16', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ ko hình tướng vật chất tu gì? tập sống với tánh, tuỳ duyên mà làm, ban rlai có hư đâu mà tu sửa, lấy thân tâm để sửa thôi,
Bạch ngôn chỉ rõ chẳng còn ngu
→lời nói trắng để các con ko lìa chính bản thể để ko cò ngu, ngay cái ngã đã có ông Phật, thức tỉnh lạy tượng mà nhớ mình là ai thì hãy lạy,
Lìa ta tìm Phật tức tu mù', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_u7kps_17', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ tụng kinh 3,6 thời, ngồi thiền ngồi ngày ngồi đêm, bỏ xác
Dụng công quán tưởng càng ngu dốt
→ thân này ko thể thành phạt vì nó trả vè cho tứ đại, đừng ép nó,
Cát sao có thể đốt thành cơm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_8daud_18', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→   vd : ngồi thiền bỏ xác
Bao lời kinh kệ đọc sớm hôm
→
Gọi Phật đọc chú vang khắp xóm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_guhqb_19', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Đánh chuông gõ mõ nhứt đôi tai
Tham sân si ngã sao ôm hoài
Vì người không rõ chốn Như Lai
Càng tu càng khổ sẽ trôi hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_2tinc_20', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Ngàn năm tu vẫn bưng bít lối
Hại người hại mình mãi bi ai
→ mình có ok đâu, kéo theo ngừoi khác khổ
Duyên nay Vô gửi pháp không hai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_f8pu4_21', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→pháp ko 2 là bất nhị, ko thể nghĩ bàn, ko dính nhị nguyên, ko thể nói  là 1 là duy nhất , ko dc dính mắc nhị nguyên nên ko dc nói 1, 2, nói số 1 cũng còn số
Hành ngay Tự Tánh sẽ chẳng sai
Thấy nghe nói biết không dính mắc
Buông dừng thôi dứt →Đạo Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_6dgm9_22', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Từ nay người rõ chân bổn tánh
→ đã thấy đạo như lai thì vừa thấy bản thể, bổn tánh của mình
Ở ngay bản thể chỗ vô sanh
Tạm gọi nơi ấy là bản thể', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_r89io_23', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ tạm gọi chứ chô đó ko hình ko tướng
Tạm gọi nơi ấy là vô sanh
Tạm gọi nơi ấy là Pháp Thân
Tạm gọi nơi ấy là Như Như', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_4yt21_24', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Thật ra chẳng thể diễn bằng từ
→ gọi chỗ đó là gì cũng là tạm vì ko diễn băng từ ko hình tướng, ko vạt chất lấy gì nói.
Vô hình vô vật nói được ư
Trôi lăn muôn kiếp nếu mệt đừ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_7eeeu_25', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ dc Cha thức tỉnh về ngay bản thể chẳng cần tu chẳng cần chứng, và chẳng cần thông các pháp.
Về nơi bản thể chốn Chân Như
→ nhớ hành
Chẳng cần tu chứng hay thông pháp', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_dyr3n_26', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ ko dính mắc, ko trói buộc→ niết bàn hiển lộ, tất cả các pháp đều đưa mình về bản thể cuả mình
Niết bàn hiển lộ đáp ngay ta
Ham tìm Công Đức để về Nhà
→ tâm hiển lộ tánh ma, dính tam tham, thì ko dùng đc công đức, muốn có công đức được, ko sao, nhưng kết quả ra sao có hay ko quan trongj, vì công đức ko phải cuả mình,', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_tzacq_27', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Cũng là vọng thức của tánh ma
Ai tìm Công Đức Vô cho hết
→ khi công đưc còn ko phải cua rminhf thì vô ngã ( ko có gì của mình)
Vô Ngã phương tiện hoá độ tha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_vxtzf_28', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ dùngf mọi thư mình đang có lấy làm phương tiện hoá độ tha
Ai tìm tha thiết chốn Phật Đà
→
Cũng là những kẻ vẫn vọng va', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_m0wg5_29', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ vọng niệm mình đi tìm,
Ai tìm chốn ấy Vô khai hết
→ chốn ấy ko tướng
Vô Tướng ở chỗ chẳng Phật Ma', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_mfqod_30', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ chỗ phật đà ko phật cũng ko ma, ko có phân ra
Giác Ngộ Giải Thoát ai kiếm tìm
→
Cũng là những kẻ bị đảo điên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9b2bx_31', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→  bị đao điên mới đi tìm giác ngộ giải thoát chứ,
Cha hỏi ai là những kẻ bị đao rđiên : thấy con đường này ròi đảo đien gì, Cha khai mở rồi, hết đien rồi trc kia thì có,
Ai duyên gặp Vô liền khai rõ
Vô Niệm vọng chơn tỉnh thức liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_44sid_32', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ ko vongj, ko chơn, đừng chấp mình đúng, đừng chấp mình la thứ gì hết á, mình đúng cũng dc sai cũng dc, Sao Cũng Dc ( tam tự kinh)
Duyên nay vọng ngữ nói luyên thuyên
→ tất cả ngôn từ Cha dùng là phương tiện cả, mà đã là phương tiện  thì thấy là chơn ý là chơn, àm ko là chơn ý thì vọng . ko dc phán xét , dùng phương tiện chỉ mặt trăng ,
Buông tự liễu nghĩa mãi an liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_syaxp_33', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ buông phương tiện dể liễu nghĩa.
Tặng cho đại chúng Gương Vô Tướng
→ gương soi cái ta, cái ngã của mình đưng soi người khác, đối với người khác hành sao cũng được.
Soi rõ thấy mình thoát vọng duyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9y8w7_34', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Đừng soi người khác sanh quan điểm
→
Để rồi dính mắc khổ ngày đêm
→', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_aksnr_35', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Tự mình soi xét ta dơ bẩn
ta dơ bẩn là tánh ma nơi mình, chứ mình làm gì có hình tướng mà dơ
Chẳng vướng bụi trần ở thật thân
Người ơi sanh tử vô lượng lần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ubkp4_36', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Đại duyên nay rõ chỗ thật chân
→ biết đc bản thể r nhớ lúc nào cũng hành như thế, đừng so đo, cứ hành ở mình thôi
Nhớ hành tinh tấn về Quê Cũ
Ở yên bản thể thoát hồng trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_23f8j_37', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Cảnh đời thuận nghịch hoặc khen chê
Ung dung cứ bước lặng lẽ về
Tùy duyên đối cảnh vô tâm khởi
Có gì của ta để mà mê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_fclbb_38', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Chúng sanh tỷ kiếp bị lông bông
Chấp chi tứ đại vốn giai không
→ thân này tan nát cũng ko nề hà
Buông đi thân mạng cho đại chúng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_71xqw_7', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Sám hối không có tư nghì
Hành ngay Tự Tánh hết đi lòng vòng
Hành không dính mắc thoát còng
Tự do tự tại mãi không luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_1h7yx_39', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', '→ miễn chúng sanh đại ngộ, nếu chúng sanh ko ngộ, thì thân nay co ích gì. 1 bậc đại nhân vô tu vô chưng thì tất cả văn thù, phổ hiền đều vượt qua hết, mơí gọi là vô tu vô chứng, ko có kim can tạng đâu, ko gì phá dc , kim cang hay di lạc ( vui vẻ, vô tư, dung chứa) tất cả, oai dức tự tự, —> cần đốn là đốn, dịu dụng là dịu dụng, ko ngôn từ nào bẻ cua được tỉnh thức hoàn toan,--> vượt qua tịnh chư nghiệp chướng, cắm 1 cây nhang đại quán chiêu hết quá khư tới giờ làm gì sai trái, tự alaidathuc tuông ra từ nghiệp qua quá khứ, cắm nhang quy chết bỏ, → phổ giác: khi giác ngộ đem phổ ra sự biêt rõ ràng ràng này, → làm đến chỗ viên tròn là viên giác → thành phật rồi nhưng còn chấp vào Phật hay ko  → hiên thiện thủ ( sống như người thường) ko ai biết mình là Phật , kim cang tạng mình còn chưa có, vì còn cả nể chúng sanh. làm đạo sư hâu như kiếp nao cung bị hại, dám bỏ thân mạng ko
Miễn chúng đại ngộ được thong dong
Duyên vì đại chúng xin chỉ đường
Nay Vô nói rõ chỗ chân thường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_05nz7_40', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Người nhận liễu ý xong vứt chữ
Nguyện cho đại chúng được Như Như
→ lúc nào cũn an nhiên tự tại
Ai duyên nhận được rõ thực hư', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_og96j_41', '6e0ea8cb-3d16-4e98-9c4c-e527f8ebd39f', 'Hành không dính mắc đồng Phật chư
__> hành ko dính mắc là đồng 1 chỗ với 10 đơi Chư Phật rồi
Tùy duyên tiếp độ tha nhân thế
→ tuỳ duyên mà độ tha,
Thong dong Quê Cũ dạo bước về
ai về thì về, ko ai về mình cư về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.520Z', '2026-06-16T03:08:15.520Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_pq6kt_0', '24c2d075-7b06-4822-b009-6999fefb9043', 'Vạn kiếp trôi lăn khắp Ta Bà
Luân hồi sanh tử vọng thức va
Trả vay ân oán rồi dính chấp
Muôn đời tu mãi chẳng rõ Ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_0m94p_1', '24c2d075-7b06-4822-b009-6999fefb9043', 'Dù người ôm mãi áo cà sa
Vạn năm không rõ đâu là Nhà
Đường về Phật Giới ngay trước mắt
Người mù càng bước càng trôi xa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_r2gu4_2', '24c2d075-7b06-4822-b009-6999fefb9043', 'Càng đi càng tạo nghiệp vay trả
Vạn năm tu tập nghiệp vẫn va
Tưởng rằng nơi đây người tỏa sáng
Người mù sao rõ lối quê Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_tv352_3', '24c2d075-7b06-4822-b009-6999fefb9043', 'Lang thang mỏi mệt vô lượng kiếp
Cầu Đạo Giải Thoát lòng tha thiết
Gặp Vị khai mở tức đại duyên
Giúp người thoát cảnh bị đảo điên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_7pe0h_4', '24c2d075-7b06-4822-b009-6999fefb9043', 'Nhận được người rõ đường an nhiên
Quyết tâm buông bỏ lối ưu phiền
Đạo nhân dẫn lối người liền thoát
Người còn mê chấp lại đảo điên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_4g3tl_5', '24c2d075-7b06-4822-b009-6999fefb9043', 'Duyên nay gửi tặng người chữ BUÔNG
Buông duyên trần thế Buông vui buồn
Buông vay Buông trả Buông vọng chấp
Buông được liền rõ Đạo đánh chuông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_u0cd6_6', '24c2d075-7b06-4822-b009-6999fefb9043', 'Buông ngay người hết vọng mê cuồng
Người liền rõ lối Về Nhà luôn
Thấy nghe nói biết không dính mắc
An nhiên tự tại dạo hành suôn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.535Z', '2026-06-16T03:08:15.535Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_ihgwz_0', '8055009e-e982-4585-aafd-9555b094a976', 'Lăng xăng cả tháng với đời
Một buổi Tỉnh Thức để rời thế gian
Nhưng người vẫn thích lang thang
Kiếp nào người mới vững đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.543Z', '2026-06-16T03:08:15.543Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_qqdhi_1', '8055009e-e982-4585-aafd-9555b094a976', 'Ai còn thích cảnh bi ai
Vô nay cũng chẳng thuyết hoài làm chi
Trần gian người thích cứ đi
Đến khi tắt thở Quy Y thế nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.543Z', '2026-06-16T03:08:15.543Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_s9xfb_2', '8055009e-e982-4585-aafd-9555b094a976', 'Ham mê tìm rác ôm vào
Đến khi mãn thể kêu gào khóc than
Lúc này mới quý Giờ Vàng
Thì người đã trót sáu đàng chuyển luân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.543Z', '2026-06-16T03:08:15.543Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_p3djt_3', '8055009e-e982-4585-aafd-9555b094a976', 'Trôi lăn bao cảnh gian truân
Ngàn đời chẳng rõ Trường Xuân nơi nào
Một đòn nhắc nhở biết đau
Ai nhận tỉnh thức liền mau về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.543Z', '2026-06-16T03:08:15.543Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_qafdt_0', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Sám hối không chỉ bằng lời
Gây ra lầm lỗi tức thời sám ngay
Phát nguyện hối cãi từ đây
Không còn tái phạm thứ gây sai lầm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_of39b_1', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Muốn cho không bị mê nhầm
Từng giây từng phút âm thầm soi Ta
Mỗi khi vọng niệm khởi ra
Người liền sám hối đập ma tan tành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_bnrpt_2', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Sám hối với cả lòng thành
Buông luôn thân mạn là hành sám chân
Ai mà khởi ý phân vân
Khởi tâm giải đãi lươn đần sám môi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9p0qa_3', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Ai mà không muốn mãi trôi
Tự mình tha thiết soi bao lỗi lầm
Quyết tâm sám hối âm thầm
Không cho ma tánh một lần dẫn đi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_9qe37_4', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Hành hạnh sám hối không nghi
Không còn sai trái ngu si ngay mình
Thấy sai sám hối thật tình
Không còn tội lỗi ngay mình an nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_phnh3_5', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Trên đời hai hạng không điên
Một là luôn đúng ưu phiền chẳng va
Một là biết lỗi ngay ta
Hành Chân Sám Hối phá ma ngay mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162358_afg1e_6', '95133e2e-bdee-41d2-b317-1fa6733fedb8', 'Duyên nay Vô gửi chút tình
Ai nhận liễu ý vô minh không còn
Hành hạnh sám hối viên tròn
Người luôn tỉnh thức không còn dính chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.552Z', '2026-06-16T03:08:15.552Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_y689h_0', 'd0d3a077-6645-4275-ba33-1a6dfc92cbf1', 'Duyên nay con đã vào đời
Muôn người hoan hỷ rạng ngời đón con
Nguyện con khôn lớn viên tròn
Nhận được NGỌC quý ngay con đủ đầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.561Z', '2026-06-16T03:08:15.561Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_xcxck_1', 'd0d3a077-6645-4275-ba33-1a6dfc92cbf1', 'Nguyện con hạnh phúc từ đây
Nguyện con tự tại ngày ngày vui tươi
Nguyện con đức hạnh điểm mười
Nguyện con rõ NGỌC muôn thời AN NHIÊN', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.561Z', '2026-06-16T03:08:15.561Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_an7xt_0', '6e57e4df-af6b-40d1-994c-5c1a0682d031', 'Càn Khôn Xoay Chuyển Quỹ Đạo Như
Vạn Vật Luân Lai Hồi Cổ Xứ
Âm Dương Tích Trữ Vô Lượng Thức
Niệm Diệt Niệm Sanh Há Oán Hư', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.571Z', '2026-06-16T03:08:15.571Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_s3vwy_0', '815891d4-9256-4bee-bdac-7510e7577322', 'Lành Thay con đã rõ mình
Bổn mệnh tại thế nhớ hành độ tha
Giúp người điên đảo thoát ra
Không còn sanh tử về Nhà Phật xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.582Z', '2026-06-16T03:08:15.582Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_53az8_1', '815891d4-9256-4bee-bdac-7510e7577322', 'Luôn hành viên mãn dẫn đưa
Giúp cho con cháu hết ưa la cà
Con ơi nhớ lấy lời Ta
Làm khi duyên hết về Nhà nha con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.582Z', '2026-06-16T03:08:15.582Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_4i1z4_2', '815891d4-9256-4bee-bdac-7510e7577322', 'Hành khi bổn nguyện viên tròn
Về nơi Diệu Hỷ không còn tử sinh
Nay con thức tỉnh rõ mình
Ta in lạc quốc chứng lòng cho con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.582Z', '2026-06-16T03:08:15.582Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_4idnd_0', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Đại Duyên Tỉnh Giác ngộ rồi
Xin được xuống tóc được rời thế gian
Nhờ Sư xuống tóc cho con
Để con buông bỏ không còn trôi lăn', 'Dạ thưa Sư, con xin Sư khai thị cho con cách cúng Cửu Huyền Thất Tổ, và người nhà đã mất của con làm sao cho đúng ạ.
Tam Vô: gửi con bài kệ', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_i9dx7_1', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Để con không dính lăng xăng
Để con thoát được cõi Trần trầm Luân
Từ nay con hết gian truân
Quyết hành tinh tấn mãi Xuân trong lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_f6env_2', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Từ nay con hết lòng vòng
Rõ đường rõ lối thoát còng trói con
Quyết hành đến chỗ viên tròn
Vô Lượng Công Đức không còn tử sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_dprl1_3', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Duyên nay xuống tóc bỏ danh
Quyết theo sư phụ Vô Danh về nhà
Lòng này chấn động Thiên ma
Hóa hiện diệu cảnh dụ con dính Trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_c4qhg_4', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Nhờ ông con hết bị đần
Quyết không dính mắc không cần thứ chi
Dù ma hóa cảnh diệu Kỳ
Rõ mình không vật không gì vướng Tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ltcfz_5', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Con nay quyết thoát mê lầm
Luôn hành tinh tấn không còn lạc trôi
Ông nay gửi tặng chữ Thôi
Thôi đi tất cả là Thôi luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_932ko_6', 'a6b6153b-1e8c-4bd3-8663-4ba2fc67b0f6', 'Con nay đã rõ đường rồi
Nguyện con viên mãn về ngôi quê Nhà
Con ơi đừng có la cà
Luôn hành tự tánh về Nhà nha con', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.593Z', '2026-06-16T03:08:15.593Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_tpnw7_0', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Thương thay tục cúng thế gian
Đến ngày giỗ quả tràn lan thịt thà
Thắp nhang khấn vái người nhà
Cầu xin đủ thứ để mà lợi Ta', 'Hướng cho chư vị lòng vòng được siêu
Nguyện cho chư vị vài điều
Kiếp sau chư vị làm người tu chân
Gặp được Sư chỉ thật thân
Sống không dính mắc một lần về quê
Nguyện cho chư vị hết mê
Công hạnh viên mãn được về Nhà xưa
Nguyện cho ai cúng dừng ưa
Dừng ưa sinh xác dừng ưa xin cầu
Nguyện cho đại chúng hết sầu
Buông dừng thôi dứt hết đau khổ mình
Nguyện cho đại chúng tỏ minh
Lập đàn cúng giỗ cúng mình trước tiên
Sống sao mình hết đảo điên
Không buồn không khổ không phiền không than
Luôn hành tự tánh mãi an
Tức người đã cúng lối đàn vô sanh
Ai Duyên liễu ý mãi lành
Nguyện cho đại chúng tử sanh không còn', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_2hoil_1', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Thành tâm thảm thiết kêu ca
Xin danh xin lợi xin nhà xin xe
Xin cho sự nghiệp lên tiên
Xin được sức khoẻ xin tiền dư tiêu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_cb289_2', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Xin cho con cháu biết điều
Xin con học giỏi xin nhiều lộc may
Xin được thuận lợi mỗi ngày
Tiền tài danh lợi xin ngày xin đêm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_1us9e_3', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Xin cho cha mẹ anh em
Vợ chồng con cháu xin thêm họ hàng
Ra đường sang chảnh khắp làng
Đến khi bày cúng thành hàng Ăn Xin', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_prgdo_4', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Ai ơi có rõ sự tình
Người kia đã mất đang cần thứ chi
Bỏ thân mà vẫn chưa đi
Ở cùng con cháu loài gì chưa siêu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_rgqct_5', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Miệng thì mong họ được siêu
Nhưng khi bày cúng đủ điều van xin
Ai ơi có hiểu hương linh
Họ cần siêu thoát gần mình làm chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_rp9t2_6', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Lập đàn chẳng giúp họ đi
Lại xin họ ở li bì nơi đây
Duyên nay gửi tặng lời này
Giúp người hiếu kính tỏ bày cúng tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_axw48_7', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Đầu tiên phát nguyện âm thầm
Tìm về bản thể hết nhầm lạc trôi
Chẳng cần tìm kiếm xa xôi
Thấy nghe nói biết chính ngôi nhà mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ry1y0_8', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Quyết hành thoát khỏi tử sinh
Sống không dính mắc ngay mình mãi an
Từ nay người đã rõ đàng
Không cần lễ bái lập đàn cầu xin', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_76xn8_9', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Duyên ngày giỗ cúng hương linh
Cơm xôi hoa quả tỏ mình biết ơn
Không xin chư vị gì hơn
Vì mình đã biết sống chơn mỗi ngày', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_c6xdi_10', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Duyên nay khai mở chỗ này
Chư vị biết rõ chốn đây vô thường
Ai sanh cũng phải một đường
Già rồi bệnh chết đừng vương xác phàm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_h9cx4_11', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Nhân duyên có hợp sẽ tan
Há gì chấp dính bất an muôn thời
Đến khi tắt thở hết đời
Vẫn còn níu giữ chẳng rời cõi đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_t5mwx_12', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Đại Duyên vị gặp pháp này
Hành ngay một chữ BUÔNG liền siêu sanh
Phát nguyện hậu kiếp nhân lành
Gặp được chánh pháp người hành thoát ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_hx8ak_13', '56dbdb16-9c64-4141-b463-e1bc376c3dde', 'Ai mà giỗ cúng ta bà
Phát tâm tinh tấn Phật Đà hành ngay
Thấy nghe nói biết mỗi ngày
Hành không dính mắc gom đầy đức công', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.603Z', '2026-06-16T03:08:15.603Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_npz5v_0', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Trôi lăn sanh tử bao đời
Hỉ nộ ái ố muôn thời khổ đau
Muốn dừng chẳng biết làm sao
Loanh quanh chẳng biết cách nào thoát ra', '127. CỬA THIỀN
Dạ thưa Cha, Ái Như con xin trình Cha chỗ con ngồi thiền. Con đang ngồi biết rõ mình đang ngồi và an nhiên mỉm cười, xong tự nhiên con đến một không gian cảnh đẹp có rất nhiều mây, con thấy Thất Cha ở đó con mừng quá chạy đến cổng gõ cửa xin vào Thất, nhưng không huynh đệ nào mở cửa cho con, con thấy có Cha bên trong nhưng Cha cũng không mở cửa Cho con. Con trèo lên đỉnh cổng thấy rõ chữ Tam Vô Thất Cha, nhưng con vẫn không trèo vào được. Con loay hoay mãi đến khi con quay lại thân căn xả thiền ra con khóc hoài.
Con xin Cha khai thị cho con, có phải con bị lạc, Cha không cho con về Nhà không ạ?
Tam Vô nói: Ta hỏi con: ai là người thấy con đang gõ cửa thất? Ai là người thấy con kêu gọi? Ai là người thấy con đang trèo qua cổng?
Ái Như: khóc nức nở nói. Dạ thưa Cha, con ngộ ra rồi. Con xin cảm niệm Ân Cha!
Tam Vô: tặng con bài kệ', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_doza5_1', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Kiếp nào cũng ở Ta Bà
Quyết tâm tìm kiếm Phật Đà nơi đâu
Toàn gặp những kẻ làm màu
Chạy theo lại dính khổ sầu thân tâm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_8ayxb_2', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Thiết tha thoát cảnh mê lầm
Đại duyên gặp Vị khai mầm liên hoa
Lệ tuông hạnh phúc vỡ òa
Duyên được khai mở bảo tòa Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_2dwrn_3', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Ngỡ rằng sẽ chẳng còn sai
Ngờ đâu người cứ bám hoài thế gian
Đạo Nhân căn dặn rõ ràng
Hành theo lời ấy tỏ đàng vô sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_kr6bw_4', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Nhưng người vẫn thích loanh quanh
Ham mê dính chấp chẳng hành lời khai
Miệng thì muốn ở Như Lai
Hành không tinh tấn ở hoài nơi đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_mefll_5', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Đã qua bao kiếp khổ sầu
Gặp Vị khai rõ còn cầu thứ chi
Chỉ cần hành đúng như Y
Làm trang Pháp Bảo hết đi luân hồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_x79jb_6', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Duyên nay nhắc nhở hãy Thôi
Thôi tại do bởi là Thôi lòng vòng
Hành theo lời dặn nhất lòng
Pháp Trần luôn có ai còng được ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_t9w6e_7', 'e1f77e69-a43f-4b31-8f55-4da6e30b5383', 'Ai ơi Thôi thích la cà
Hãy hành tinh tấn về Nhà quê xưa
Nguyện cho đại chúng rõ Thừa
Pháp Trần tiếp dẫn tự đưa người về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.610Z', '2026-06-16T03:08:15.610Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_zjqh3_0', 'cb2c9647-2c75-4620-abbd-d503411348c4', 'Lành thay con cháu thỉnh cầu
Tam Vô trụ thế mở Cầu dẫn đưa
Giúp cho đại chúng có Thừa
Giác Ngộ Giải Thoát quê xưa chúng về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.614Z', '2026-06-16T03:08:15.614Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ckyvh_1', 'cb2c9647-2c75-4620-abbd-d503411348c4', 'Thỉnh cầu tha thiết hết mê
Thiên Địa đã thấu muôn bề châu rơi
Nay khuyên con cháu ở đời
Đừng ham chơi mãi mà rời Nhà xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.614Z', '2026-06-16T03:08:15.614Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ov5zf_2', 'cb2c9647-2c75-4620-abbd-d503411348c4', 'Cảnh đời lúc nắng lúc mưa
Vô thường thay đổi đường xưa hằng còn
Hiện Vô tiếp độ cháu con
Đến khi duyên hết con còn Bổn Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.614Z', '2026-06-16T03:08:15.614Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ok1vb_3', 'cb2c9647-2c75-4620-abbd-d503411348c4', 'Duyên đoạn con chớ bi ai
Ở nơi bản thể Như Lai làm Thầy
Về đây con hết Sa Lầy
Nguyện cho con cháu sớm ngày Đạo Viên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.614Z', '2026-06-16T03:08:15.614Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_cbhic_0', '5f0889c6-4747-43bb-ac9d-5fd27364bdba', 'Các con các cháu tỏ lòng
Trình kệ sở ngộ thoát còng thế gian
Nguyện cho con cháu rõ Đàng
Thấy nghe nói biết chẳng màng dính chi', 'Con Cháu Cùng Chúng Sanh', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.620Z', '2026-06-16T03:08:15.620Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_jhry6_1', '5f0889c6-4747-43bb-ac9d-5fd27364bdba', 'Từ nay đã rõ lối đi
Nhớ hành tinh tấn ngu si không còn
Nguyện cho con cháu viên tròn
Về nơi Quê cũ không còn tử sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.620Z', '2026-06-16T03:08:15.620Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_escj0_0', '5054f66e-69a6-48e3-80a8-b254488a9ec1', 'Lành thay con Cháu tỏ bày
Nhận được bản thể thoát lầy thế gian
Từ nay con đã rõ Đàng
Buông đi tất cả an nhàn thảnh thơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.623Z', '2026-06-16T03:08:15.623Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_lzhcd_1', '5054f66e-69a6-48e3-80a8-b254488a9ec1', 'Con ơi đang sống ở đời
Tùy duyên đối cảnh chẳng rời bổn lai
Con ơi sống đúng đừng sai
Nguyện con viên mãn về Ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.623Z', '2026-06-16T03:08:15.623Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_p7cp0_0', '598a58c9-b421-498b-a64c-f33ae480668a', 'Vạn Niên Truy Cầu Đắc Tâm An
Lạc Ta Truy Tậu Bất An Thường
Bản Lai Vô Vật Tâm An Trú
Nhị Nhãn Bất Dụng Hiển Tâm An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.628Z', '2026-06-16T03:08:15.628Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_wu5dv_0', '3bb0e604-e291-4b19-bb71-b3afa53dfbb4', 'Tôn Tử Đại Ngộ Kỳ Tâm Đắc
Tinh Thông Vạn Vật Đồng Ma Dắt
Tổ Phụ Ngự Đảnh Phá Tu Di
Hiếu Đạo Mãn Viên Đáo Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.632Z', '2026-06-16T03:08:15.632Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_yguhj_0', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Sáng ra tĩnh tọa một mình
Đến khi xã tọa bình minh đón chào
Bắt đầu nghe tiếng kêu gào
Từ nam ra bắc nơi nào cũng vang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_thsah_1', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Sáng nào cũng được ăn sang
Tơ Nhện xào Đĩa đã hầm nhiều hôm
Dọn thêm mấy dĩa đầu tôm
Khổ qua nhồi ớt bọc ôm sấu rừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_gyzgm_2', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Buổi trưa ăn uống tưng bừng
Bọ cạp rắn rết đã chưng cả nồi
Lẩu cua lươn ếch làm mồi
Rượu bia thuốc lá là ngồi hết trưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_h2clf_3', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Tối càng ăn uống say xưa
Ruồi trộn dòi chúa chiên bừa một thau
Sán dây sán lá món xào
Rận rệp sam biển nướng chao thơm lừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_glmz9_4', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Ăn xong rồi phải đi mần
Lao công quét rác ân cần siêng năng
Quản thêm lũ trẻ lăng xăng
Chuẩn bị cơm nước chúng ăn ấm lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_1x22w_5', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Nhận thêm nghề mở khóa còng
Tài xế chở đám lòng vòng thoát ra
Rồi làm thầy pháp bắt ma
Nhân viên hướng dẫn đường ra khỏi rừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_6v1vy_6', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Bác sĩ trị bệnh tưng tưng
Dược sĩ bóc thuốc hết ưng thứ gì
Giáo viên Phá hết ngu si
Dội bom Phá núi tu di không còn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_49mbr_7', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Làm Cha làm mẹ nuôi con
Làm Ông dạy cháu cho tròn bổn lai
Rảnh rang đi lượm ve chai
Tự tay Tái chế thành hài vô song', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_q3t04_8', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Quy hoạch bãi rác thong dong
Làm nơi đổ rác vẫn không phiền lòng
Lái đò đón kẻ lòng vòng
Xong rồi thẩm mỹ từ trong ra ngoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_pnlpj_9', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Làm nghề cướp bóc bi ai
Làm tên trộm cắp thói sai người đời
Chuyên gia lừa lọc muôn thời
Làm tên dụ dỗ nghe lời bị An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ggta0_10', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Từ thiện chẳng tiếng thở than
Ngọc ngà châu báu bạc vàng đều cho
Chẳng cần tính toán so đo
Ai duyên nhận được hết lo ưu phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_66k20_11', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Dạo nghề diễn cảnh Phá điên
Nghề nào cũng nhận miễn người hết mê
Tùy duyên tiếp dẫn người về
Rõ nơi bản thể chính Quê Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_2i1dc_12', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Mỗi ngày dạo cảnh la cà
Lang thang lặn lội tìm ra con mình
Nắm đầu kéo khỏi vũng sình
Tắm rửa sạch sẽ rồi rinh về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_k8wkl_13', '009b259c-cea8-43da-99d0-69d6e3253de0', 'Đứa nào còn cứ la cà
Nện cho một búa tánh ma mất liền
Đứa nào còn mãi đảo điên
Như Lai ngự đảnh về Liền Nhà xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.639Z', '2026-06-16T03:08:15.639Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_cruhj_0', 'd7dae3ee-8284-4125-947f-b478812720d8', 'Trần gian đáng kính hai người
Người Chơn Sám Hối người hành không sai
Nay con buông ngã lành thay
Trình ra đại chúng nhận ngay chính mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.644Z', '2026-06-16T03:08:15.644Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_6bvl6_1', 'd7dae3ee-8284-4125-947f-b478812720d8', 'Ai duyên ngộ rõ sự tình
Sống luôn tỉnh thức ngay mình soi ta
Nguyện người lìa hết tánh ma
An nhiên tiếp dẫn độ tha về Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.644Z', '2026-06-16T03:08:15.644Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_rdwip_0', 'cbe9f225-6d36-4d31-ac7e-91cc817e61b4', 'Vạn năm ở mãi ta bà
Tìm hoài chẳng thấy Phật Đà ở đâu
Các con cứ mãi u sầu
Buồn vui sướng khổ biết đâu mà lần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.649Z', '2026-06-16T03:08:15.649Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_c4o1u_1', 'cbe9f225-6d36-4d31-ac7e-91cc817e61b4', 'Lành thay con đã rõ đàng
Như Lai thanh tịnh hằng tại các con
Hành ngay Phật tánh viên tròn
Đủ công đủ đức không còn tử sanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.649Z', '2026-06-16T03:08:15.649Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_kd5an_2', 'cbe9f225-6d36-4d31-ac7e-91cc817e61b4', 'Ngàn đời ngàn kiếp loanh quanh
Kiếp này đã tỉnh quyết hành nha con
Nguyện cho các cháu các con
Kiếp này viên mãn quê xưa con về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.649Z', '2026-06-16T03:08:15.649Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_kt6on_0', 'a1dc1ae0-b8ea-41b8-bab4-f150b4be1701', 'Bao năm khuya sớm đưa đò
Vượt ngàn sóng gió giúp người qua sông
Ngày đêm chèo lái không công
Lãi nhiều gươm giáo đâm hông lưng còng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.653Z', '2026-06-16T03:08:15.653Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_oxphf_1', 'a1dc1ae0-b8ea-41b8-bab4-f150b4be1701', 'Miễn người hết cảnh lòng vòng
Hết trôi hết nỗi thoát sông vào bờ
Dù ai chẳng nhớ lão đò
Lão luôn dạo sóng đưa đò thong dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.653Z', '2026-06-16T03:08:15.653Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_5wenh_2', 'a1dc1ae0-b8ea-41b8-bab4-f150b4be1701', 'Hết duyên để lại con sông
Cùng Đò Không Đáy ai thông chèo về
Vượt sông Bát Nhã rõ Quê
Bỏ Đò gặp Lão còng lưng ở Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.653Z', '2026-06-16T03:08:15.653Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_vu2le_0', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Linh Đan xin hỏi Sư Ông
Vì sao Yêu Quái thích ăn Tam Tạng?
Lành thay con hỏi Bảo Đàng
Nay duyên ông chỉ rõ ràng Yêu Tinh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_guxn4_1', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Vạn yêu cũng giống như mình
Cố tìm đến chốn tử sinh không còn
Tu tập ngàn kiếp không tròn
Ngỡ rằng Tam Tạng xác phàm trường sinh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_jqsdl_2', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Chỉ cần ăn được vào mình
Sẽ được bất tử bất sinh muôn thời
Yêu mà sống Quái ở đời
Ăn cục thịt thối sao cầu Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_x983s_3', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Chỉ toàn thấy cảnh bi ai
Tham sân si ái khởi hoài không an
Muôn thời muôn kiếp thở than
Duyên nay ông chỉ rõ đàng Trường Sinh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_homvy_4', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Chỉ cần biết rõ chính mình
Tam Tạng kinh điển ngay mình tỏ thông
Quy Y là được ăn xong
Trường sinh bất tử thong dong muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_vv99i_5', 'd6ea0d81-e527-4164-bb6e-6e3ff8311e06', 'Con ơi khi sống ở đời
Đừng ham thể tướng mà rời bổn lai
Hành nơi thể tánh không sai
Ung dung tự tại an hoài mọi nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.658Z', '2026-06-16T03:08:15.658Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ne7i9_0', '9034bd91-45da-4337-8b07-6c6f2ce87fb3', 'Lão Ươm có bẩn có bần
Cũng là hốt cứt dọn phân cho người
Đến khi sạch sẽ vui tươi
Chớ cười Ươm lão trên người đầy phân', '- Dạ thưa Sư Cha. Tịnh liên con có nghiên cứu thần số học, con xin Sư Cha khai thị cho con biết là thần số học có nói đúng không ạ? Con xin Sư Cha khai thị cho con biết ý nghĩa các con số ạ.
- Tam Vô: con hãy nghe bài Kệ Vè này.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.663Z', '2026-06-16T03:08:15.663Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_y0wm5_1', '9034bd91-45da-4337-8b07-6c6f2ce87fb3', 'Lành thay người đã hết đần
Thành tâm sám hối lỗi lầm đâm chê
Lành thay người đã hết mê
Lão đi hốt tiếp cười hề thong dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.663Z', '2026-06-16T03:08:15.663Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_kbwlz_2', '9034bd91-45da-4337-8b07-6c6f2ce87fb3', 'Nguyện cho người được thoát còng
Ở yên bản thể đừng trông lão già
Nguyện cho người hết la cà
Giác Ngộ Giải Thoát về Nhà Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.663Z', '2026-06-16T03:08:15.663Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_yi4ek_0', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Vô vật bản thể - Nhất niệm hằng quy
Bất nhiễm Lưỡng nghi - niệm ngôi Tam Bảo
Diệu đế Tứ lão - lìa Ngũ ấm ma
Lục độ ba la - bồ đề Thất giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_6kptd_1', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Chánh đạo hữu Bát - Cửu phẩm liên hoa
Thập viên ngự Gia - viên buông Thập Nhất
Thập Nhị duyên dứt - viên bảo Thập Tam
Thập Tứ viên đàm - Thập Ngũ viên ấm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_lxxju_2', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Thập Lục viên độ - Thập Thất viên tình
Thập Bát viên minh - Thập Cửu viên kết
Nhị Thập lưỡng hết - Nhị Nhất tập tân
Song Nhị lưỡng phân - Nhị Tam lưỡng giới', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_xrfjc_3', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Nhị Tứ lưỡng đế - Nhị Ngũ lưỡng ma
Nhị Lục lưỡng xà - lưỡng liên Nhị Thất
Nhị Bát lưỡng chánh - Nhị Cữu lưỡng tiêu
Tam Thập Bảo viên - Bảo buông Tam Nhất', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_t2l94_4', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Tam Nhị độc tách - độc Giới Song Tam
Tam Tứ độc giam - Tam Ngũ độc ấm
Tam Lục độc trần - Tam Thất độc mê
Tam Bát bảo quê - Tam Cửu bảo phẩm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_sd0kn_5', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Tứ Thập đế trẫm - Tứ Nhất đại buông
Tứ Nhị xứ nguyên - Tứ Tam xứ bảo
Song Tứ tổng đạo - Tứ Ngũ diệu căn
Tứ Lục cần căn - Tứ Thất cần giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_4zscj_6', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Đế Chánh tứ bát - Tứ Cửu diệu liên
Ngũ Thập lực viên - lực buông Ngũ Nhất
Ngũ Nhị ấm tách - ấm bảo Ngũ Tam
Ngũ Tứ ấm giam - Ngũ Song cân đối', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_117rd_7', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Ngũ Lục hành thức - Ngũ Thất hành liên
Ngũ Bát hành thiền - Ngũ Cửu hành đích
Lục Thập độ thích - Lục Nhất độ quy
Lục Nhị độ nghi - Lục Tam độ giới', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_p2yzc_8', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Lục Tứ mật đế - Lục Ngũ mật ma
Song Lục mật la - Lục Thất mật giác
Độ đạo Lục Bát - Lục Cửu độ liên
Thất Thập bộ viên - bộ buông Thất Nhất', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_pb8rd_9', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Thất Nhị tình đối - tình độc Thất Tam
Thất Tứ tình giam - Thất Ngũ tình ấm
Thất Lục phần thức - Song Thất phần liên
Thất Bát giác thiền - giác liên Thất Cửu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_stlhf_10', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Bát Thập đạo đủ - Bát Nhất đạo buông
Bát Nhị đạo nguyên - Bát Tam đạo giới
Bát Tứ chánh đế - Bát Ngũ chánh hành
Bát Lục chánh trần - Bát Thất chánh giác', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_37omh_11', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Dụng đạo Song Bát - Bát Cửu dụng liên
Cửu Thập phẩm viên - phẩm dừng Cửu Nhất
Cửu Nhị phẩm đối - phẩm bảo Cửu Tam
Cửu Tứ đích giam - đích hành Cửu Ngũ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_smhme_12', 'aafd4b2b-1c0b-4ae4-9e96-f373be5fd024', 'Cửu Lục liên đủ - Cửu Thất liên chi
Cửu Bát liên quy - liên tiêu Song Cửu
Nhất Bách viên mãn - ai ngộ an nhiên
Số Đạo luyên thuyên - ai thông tự tại', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.670Z', '2026-06-16T03:08:15.670Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ywx2b_0', 'd602635e-4266-446c-98eb-582a508be2f5', 'Lành thay con cháu tỏ bày
Nhớ ngày Thị Hiện biết quay Về Nhà
Cùng nhau trình kệ Kính Cha
Một lòng quyết chí thoát va hồng trần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.674Z', '2026-06-16T03:08:15.674Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_i4cs3_1', 'd602635e-4266-446c-98eb-582a508be2f5', 'Nguyện cho con cháu hết đần
Sống không dính mắc thoát trần Về Quê
Nguyện cho con cháu hết mê
Kiếp này viên mãn được về Nhà Xưa.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.674Z', '2026-06-16T03:08:15.674Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_fvd7l_0', '48ab2e38-745b-4c9b-ab7e-1d5390bd9c72', 'Nhân gian sao thật lạ kỳ
Ham mê đón nhận những gì tốt thân
Chê bai những thứ xấu bần
Gặp được Ngọc Quý đem cân ra lường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.680Z', '2026-06-16T03:08:15.680Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_r6iol_1', '48ab2e38-745b-4c9b-ab7e-1d5390bd9c72', 'Sống trong huyễn cảnh vô thường
Cân đo đong đếm lạc đường Vô Sanh
Muốn được thoát cảnh loanh quanh
Vô Tâm đối cảnh tịnh thanh muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.680Z', '2026-06-16T03:08:15.680Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_p2uu9_2', '48ab2e38-745b-4c9b-ab7e-1d5390bd9c72', 'Ai ơi khi sống ở đời
Tùy duyên tốt xấu chớ rời bổn lai
Vạn vật nhất thể không hai
Nhận được thể Tánh chẳng sai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.680Z', '2026-06-16T03:08:15.680Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_9ln8p_3', '48ab2e38-745b-4c9b-ab7e-1d5390bd9c72', 'Đại duyên cầu pháp rõ Nhà
Vả cho một cái Ngộ ra Tánh mình
Thấy nghe nói biết hằng minh
Hành không dính mắc tử sinh không còn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.680Z', '2026-06-16T03:08:15.680Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_q6u75_0', '67a5e552-0e87-4701-95d0-6f63c5827640', 'Học đạo là để hành đời
Đừng ham lý thuyết mà rời thế gian
Đời đâu báo trước gian nan
Thình lình ăn Vả có an không nào', 'Đệ  Tử Và Chúng Sanh', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.685Z', '2026-06-16T03:08:15.685Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_x73se_1', '67a5e552-0e87-4701-95d0-6f63c5827640', 'Cảnh thuận thì thích ôm vào
Đến khi nghịch cảnh càu nhàu trách than
Sống sao mãi được thanh nhàn
Tùy duyên đối cảnh chẳng than chẳng phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.685Z', '2026-06-16T03:08:15.685Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_tqjp6_2', '67a5e552-0e87-4701-95d0-6f63c5827640', 'Muốn cho hết bị đảo điên
Cảnh đời thay đổi ở yên Tánh mình
Dù cho vạn cảnh diệt sinh
Vạn vật nhất thể rõ mình hằng an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.685Z', '2026-06-16T03:08:15.685Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_wp72x_0', 'c650b625-0c8b-4d5f-912d-f2c42fa0b77d', 'Vạn kiếp độ tận chốn nơi đây
Chung quy nhìn lại chúng vẫn say
Miệng đời phát nguyện tinh tấn bước
Thân thủ tâm can mãi mê hoài', 'Đệ  Tử Và Chúng Sanh', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.692Z', '2026-06-16T03:08:15.692Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_k3ei4_1', 'c650b625-0c8b-4d5f-912d-f2c42fa0b77d', 'Kim thời hóa độ hồi viên mãn
Hoàn trả bụi hồng chốn nhân gian
Kẻ mê trú ngụ hoài than khổ
Hỏi ai quy xứ dạo thanh nhàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.692Z', '2026-06-16T03:08:15.692Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_oatvz_0', 'c2ed57c8-be12-4fa1-bfba-76ff20e1220c', 'Sinh ra trong cõi u minh
Thọ thân tứ đại quên mình là ai
Ngũ hành ngũ ấm ngục cai
Tầng tầng lớp lớp mê hoài nơi đây', 'Đệ  Tử Và Chúng Sanh', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.696Z', '2026-06-16T03:08:15.696Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_7c23f_1', 'c2ed57c8-be12-4fa1-bfba-76ff20e1220c', 'Đại duyên nghe pháp thoát lầy
Nhận ra tự tánh ngay đây tỏ tường
Tự mình cất bước lên đường
Yêu ma quỷ quái luôn thường ẩn thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.696Z', '2026-06-16T03:08:15.696Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_2qd3c_2', 'c2ed57c8-be12-4fa1-bfba-76ff20e1220c', 'Thấy nghe nói biết mười phân
Phát hiện yêu quái mỗi lần ló ra
Ở yên bản thể ngay ta
Không theo không dính yêu ma tan liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.696Z', '2026-06-16T03:08:15.696Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_enue2_3', 'c2ed57c8-be12-4fa1-bfba-76ff20e1220c', 'Người liền thoát cảnh ưu phiền
Từ nay người sống an nhiên muôn thời
Ai ơi đang sống ở đời
Năm Mười Liễu ý thường chơi rõ Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.696Z', '2026-06-16T03:08:15.696Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_09v9a_0', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Rừng xanh hiểm trở trùng trùng
Chim kia bay nhảy kiếm tìm thứ chi
Thấy nơi yên ổn tức thì
Tìm ngay cỏ tốt để đi xây nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_bc5q2_1', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Mỗi ngày chẳng quảng đường xa
Chẳng lo hiểm trở xây nhà cho xong
Hoàn thành Chim chẳng ở không
Lo sinh lo ấp lo trông con mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_suvj2_2', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Biết bao nguy hiểm mò rình
Chim luôn che chở con mình bình an
Đến khi vỏ trứng vỡ tan
Cả nhà hạnh phúc nhưng càng mệt hơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_7ka5z_3', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Chim non la hét hay hờn
Đứa lạnh đứa đói đứa gầy đứa đau
Chim mẹ chẳng quảng khổ sầu
Bay tìm khắp chốn bắt đào dế giun', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_y8qn8_4', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Dù gặp bao cảnh gian truân
Chim mẹ chiến đấu đến cùng vì con
Miễn sao con cái no tròn
Chim mẹ chịu cảnh no đòn vẫn vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_3qb2e_5', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Ngày ngày Chim mẹ lui cui
Lo ăn lo uống lau chùi cho con
Ngày ngày ăn Cứt chim non
Chim mẹ chẳng oán miễn con trưởng thành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_h8cal_6', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Mỗi ngày Chim mẹ loanh quanh
Cũng vì con nhỏ được nhanh thành hình
Đến khi lông mọc khắp mình
Chim mẹ chỉ cách con mình tập bay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_gztsp_7', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Chỉ con nghe thấy rõ bầy
Chỉ con biết hót biết cày kiếm ăn
Chỉ con hết chỗ lăng xăng
Chỉ con biết cách tự lăn cuộc đời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_wi5x2_8', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Chim mẹ cũng đến khắc thời
Cát bụi mẹ trả dứt hơi lên đường
Bởi đây là lẽ vô thường
Chim mẹ viên mãn chỉ đường Chim non', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_dszsa_9', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Chim nào Liễu ý sẽ tròn
Nhớ là Chim mẹ nuôi con bao đời
Chim thì bay lượn trên trời
Chim con sẽ vậy chẳng thời đổi thay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_pbk3b_10', 'a0fdf7d4-bca6-4cbc-91dc-5ba6f5f9aae1', 'Đại duyên vô nói chỗ này
Chim Chi Liễu ý biết ngay chính mình
Vô duyên sẽ mãi tử sinh
Hữu duyên tỉnh ngộ đời mình mãi an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.701Z', '2026-06-16T03:08:15.701Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_yqezp_0', '73045457-3607-41cf-a642-1cb9d3694497', 'Thương thay tu hú ở đời
Trứng mình sinh ké ở nơi tổ người
Đến khi trứng nở tươi cười
Được cho ăn uống được chăm tận tình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_rwv1x_1', '73045457-3607-41cf-a642-1cb9d3694497', 'Dù cho mới được khai sinh
Vẫn chưa mở mắt tánh tình không thay
Thấy mẹ đang quấy ngoan ngay
Mẹ vừa đi khỏi liền bày tánh ma', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_85uk5_2', '73045457-3607-41cf-a642-1cb9d3694497', 'Liên hồi quấy phá trong nhà
Anh chị em khác khóc la chẳng màn
Hãm hại chim khác trong đàn
Một mình chiếm tổ hung tàn thỏa thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ttdsf_3', '73045457-3607-41cf-a642-1cb9d3694497', 'Chim Mẹ Nuôi vẫn ân cần
Nén bao đau đớn nuôi thân con người
Dù cho còn một đứa lười
Con ai cũng được cũng cười cũng nuôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_sr9dj_4', '73045457-3607-41cf-a642-1cb9d3694497', 'Ngày ngày Chim mẹ lui cui
Lo ăn lo uống lau chùi cho con
Đến khi tu hú to tròn
Đủ lông đủ cánh vẫn còn đòi ăn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_sne7s_5', '73045457-3607-41cf-a642-1cb9d3694497', 'Chim mẹ chẳng chút lăn tăn
Vẫn cày vẫn đút thức ăn thật nhiều
Vẫn dạy tu hú bao điều
Thấy nghe biết hót rõ nhiều điều hay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_z4g59_6', '73045457-3607-41cf-a642-1cb9d3694497', 'Chỉ cho tu hú biết bay
Chỉ cho tú hú biết cày kiếm ăn
Miễn sao tu hú ăn năn
Không theo ma tánh mà hằng an nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_goi7i_7', '73045457-3607-41cf-a642-1cb9d3694497', 'Trớ trêu tu hú vẫn điên
Đến mùa sanh sản vẫn tìm tổ thay
Chẳng biết làm tổ tự tay
Đem con đi gửi mặc mày diệt sinh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ckh89_8', '73045457-3607-41cf-a642-1cb9d3694497', 'Đến khi chuốt họa vào mình
Cũng do cái thói vô tình vô tâm
Đến khi nhận thấy lỗi lầm
Mẹ con đều mất mãi cầm nỗi đau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_x3lu0_9', '73045457-3607-41cf-a642-1cb9d3694497', 'Ai ơi nhận thấy tỉnh mau
Đừng như tu hú ngày sau khổ sầu
Sống sao đừng có tư cầu
Hung tàn ích kỷ khổ đau người mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_lclgh_10', '73045457-3607-41cf-a642-1cb9d3694497', 'Ai mà hiểu rõ sự tình
Đừng như tu hú đời mình mãi an
Sống chung một tổ an nhàn
Cùng nhau dìu dắt về đàng an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_voxnk_11', '73045457-3607-41cf-a642-1cb9d3694497', 'Duyên xem tu hú diễn viên
Ai mà liễu ý ở yên tánh mình
Thấy nghe nói biết hằng minh
Sống không dính mắc đời mình mãi an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.706Z', '2026-06-16T03:08:15.706Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_px2t6_0', '608bce72-616d-4d1e-a072-55f5c13a3ab3', 'Hầu Khiêu Kỵ Mã Ngàn Trùn   g Xa
Tung Hoành Ngang Dọc Khắp Bôn Ba
Thần Thông Quảng Đại Tu Vi Nhất
Hòa Dĩ Bất Khả Đoạt Thủ Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.712Z', '2026-06-16T03:08:15.712Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_ub0ay_0', '580eadf8-6c57-4d41-92ee-afcdc9de04e8', 'Thương thay nhân thế ở đời
U mê chấp niệm đời đời chuyển luân
Quán âm đem đến mùa xuân
Kẻ mê ngăn cản gian truân thỉnh ngài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.718Z', '2026-06-16T03:08:15.718Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_zn6bc_1', '580eadf8-6c57-4d41-92ee-afcdc9de04e8', 'Ngàn năm khổ não dài dài
Đến khi mệt mỏi cầu ngài nơi đâu
Thiết tha mẹ vẫn hiện màu
Giúp cho con cháu khổ đau không còn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.718Z', '2026-06-16T03:08:15.718Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_in06q_0', 'ad80e984-5814-4b9e-b79e-1d9c690d26a6', 'Cỏ cây hoa lá mọc ven đường
Hương thơm bóng mát vạn người thương
Hỏi ai lối rộng sao không bước
Cớ sao giẫm đạp cỏ hoa đường', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.723Z', '2026-06-16T03:08:15.723Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_28bmb_0', '942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Than tro lửa cháy mà thành
Tro tàn đen đũi mặt mày tối thui
Chỉ cần gõ nhẹ than trui
Vỡ tan từng mảnh bùi nhùi làm phân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_1pjdu_1', '942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Lửa hùng nóng rực vạn lần
Đốt tan mọi thứ lại thành Kim Cương
Dù cho tàn Phá đủ đường
Vẫn luôn sáng chói muôn phương muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_1gjxt_2', '942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Hữu duyên rõ Đạo Lửa Trời
Dù thăm địa ngục ngộ Lời liền an
Cảnh thuận cảnh nghịch chẳng mang
Thong dong dạo bước an nhàn mọi nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_x9r20_3', '942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Kim Cương vốn sẵn mình rồi
Lại không chịu nhận thích làm Than Tro
Suốt ngày ham cảnh mượn cho
Ngờ đâu mình vốn đủ no muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162359_zohky_4', '942d12d0-e3ff-4e1f-bf23-b5c3f5d90a42', 'Ai ơi đang sống ở đời
Rõ thân chân thật liền rời giả thân
Thấy nghe nói biết mười phân
Công hạnh viên mãn một lần về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.732Z', '2026-06-16T03:08:15.732Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_f2pjr_0', '90d1e116-7a9c-4204-991f-5532306cf871', 'Hoàng hôn ở Đất Phương Nam
Có con gà trống lang thang ra vào
Nhảy qua 6 nhánh mai đào
Tụ họp cọp sói heo rừng và nai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ih0b9_1', '90d1e116-7a9c-4204-991f-5532306cf871', 'Cùng nhau kiếm cái sinh nhai
Cạo lông thay áo thành hài cao nhân
Cái ăn chẳng phải phân vân
Chỉ còn cái ngủ phơi thân ngoài trời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_d9xp5_2', '90d1e116-7a9c-4204-991f-5532306cf871', 'Gà kia chỉ muốn một đời
Chiều nào cũng bước tìm nơi bồ đề
Kềnh kềnh Cú Quạ trăm bề
Thợ săn cọp sói heo rừng lăm le', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_2zaes_3', '90d1e116-7a9c-4204-991f-5532306cf871', 'Tôn Gà làm tướng chở che
Đi theo một lũ kẹt xe kẹt đường
Nhận ra thấy cảnh bất thường
Vua lệnh giải tán Gà về Tây Sơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wu6xv_4', '90d1e116-7a9c-4204-991f-5532306cf871', 'Kẻ vui kẻ khóc kẻ hờn
Mỗi ngày Gà chỉ lờn vờn Cà Tiêu
Bổng nhiên vào một buổi Chiều
Gà kia muốn được về miền tây thiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_iqzrx_5', '90d1e116-7a9c-4204-991f-5532306cf871', 'Phương Nam Gà bỏ đi liền
Lũ kia được dịp đảo điên theo cùng
Lại tạo bao cảnh điên khùng
Hơn thua cãi vã lùng bùng khắp nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_01dkc_6', '90d1e116-7a9c-4204-991f-5532306cf871', 'Dù cho Gà mệt đứt hơi
Kềnh kềnh Quạ Cú chẳng thời dừng tay
Thợ săn cọp sói hiện thầy
Heo rừng nai cứ mỗi ngày ăn theo', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_4qh92_7', '90d1e116-7a9c-4204-991f-5532306cf871', 'Mỗi ngày Gà nhảy thang leo
Được Tôn Gà cứ càng trèo càng cao
Lâm nguy chẳng thể kêu gào
Cả đàn ăn ké càng bào càng vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_igmbk_8', '90d1e116-7a9c-4204-991f-5532306cf871', 'Chiều nào Gà cũng lui cui
Vướng vào một đống bùi nhùi trách ai
Chỉ vì một nút gắn sai
Kéo theo một loạt nút cài lung tung', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_zam45_9', '90d1e116-7a9c-4204-991f-5532306cf871', 'Dù cho Gà có phát khùng
Đám kia cũng chẳng chịu dừng mồi ngon
Một khi hình tướng Gà còn
Đám kia cứ vẫn bào mòn ngày đêm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wniqe_10', '90d1e116-7a9c-4204-991f-5532306cf871', 'Hoàng hôn tắt lộ màn đêm
Gà tìm chỗ ngủ tạm êm cuộc đời
Một ngày Gà muốn tách rời
Không còn dính lũ ẩn nơi một mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_zlww8_11', '90d1e116-7a9c-4204-991f-5532306cf871', 'Đời Gà tạm chỗ yên bình
Uổng cho một kiếp nhân sinh Gà Mờ
Dù cho Gà được tôn thờ
Chính Gà tự biết mình Ngơ thế nào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ymywc_12', '90d1e116-7a9c-4204-991f-5532306cf871', 'Giờ đây chẳng biết làm sao
Ẩn mình cũng chẳng thể nào tỏ thông
Dù Gà có bước lông bông
Lại bị lũ ké đẩy ngông lên trời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_eeiru_13', '90d1e116-7a9c-4204-991f-5532306cf871', 'Chỉ khi Gà sống ở đời
Tìm được bản thể liền rời thế gian
Gặp được Vị chỉ rõ đàng
Hành được bổn tánh tự an muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_opfq2_14', '90d1e116-7a9c-4204-991f-5532306cf871', 'Ai duyên liễu ý bỏ lời
Sống không dính mắc muôn đời an yên
Dù cho vạn cảnh đảo điên
Người luôn tự tại ở miền Phật Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.738Z', '2026-06-16T03:08:15.738Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_5dxf0_0', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'An Nam Trung Bộ Ngũ Hành Sơn
Tam Thiên Niên Ngụ Động Kim Sơn
Quán Âm Vô Tự Kinh Hoàn Tổ
Ai Duyên Đại Ngộ Niệm Đại Ơn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_4bdhz_1', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Hoa Phượng Phi Thiên Rụng Khắp Nơi
Trống Trường Vang Vọng Tụ Bác Thời
Duy Nghĩa Duy Xuyên Niên Hổ Hỏa
Đại Duyên Tam Vô Hiện Cõi Đời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_eau8g_2', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Tiết Thời Mát Dịu Thu Thanh Thản
Cam Lồ Tuần Thuỷ Đại Chúng An
Bao Cấp Thời Tàn Duyên Đoạn Dứt
Nam Quốc Phục Hồi Phúc An Khang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_l11z6_3', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Hoa Phượng Tái Nở Đạt Thất Chừng
Di Cư Long Hải Phước Lộc Hưng
Ngao Du Nghịch Cảnh An Nhiên Sống
Tự Lái Cuộc Đời Tự Chấn Hưng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_1z9xy_4', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Bao Hồi Mơ Cảnh Bị Lông Bông
Lạc Hành Đa Cảnh Thuận Nghịch Dòng
Cảnh Thời Tự Tại Phi Khắp Chốn
Cảnh Thời Ma Quái Đả Hậu Mông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ambgg_5', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Nghịch Cảnh Chư Ma Đuổi Lòng Vòng
Đa Thời Tỉnh Mộng Ngộ Tánh Không
Duyên Mơ Tái Cảnh Rược Ma Tẩn
Tam Thời Đại Tẩn Mộng Thong Dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wk9z4_6', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Ân Ma Hộ Mệnh Mơ Hằng Tỉnh
Dạo Muôn Mộng Cảnh Giác Trường Sinh
Thần Thông Quảng Đại Tự Tâm Thức
Mộng Cảnh Thuận Nghịch Tự Tỏ Minh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wj29b_7', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Thập Bác Niên Thọ Cư Thủ Đức
Đại Học Hoàn Tất Bằng Tự Vứt
Dạo Cảnh Đời Thường Luôn Tự Tại
Nhân Nghĩa Trí Tín Chẳng Phụ Ai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wxjb4_8', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đa Thời Tự Chiếu Đời Vẫn Sai
Tiền Tài Danh Vọng Chúng Bi Ai
Thất Tình Lục Dục Luôn Dính Mắc
Luân Hồi Lục Đạo Chúng Than Hoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_nkaf7_9', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đa Thời Bất Ngộ Tưởng Tương Lai
Nên Duyên Gia Thất Sẽ An Hoài
Ngờ Đâu Cục Diên Nguyên Như Thế
Hạnh Phúc Tạm Bợ Lẫn Bi Ai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_0onmp_10', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đại Duyên Thân Phụ Rời Nhân Gian
Lo Cho Thân Phụ Đọa Ác Đàng
Tam Thập Niên Thọ Buông Bỏ Hết
Tìm Nơi Bản Thể Chốn Hằng An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_fsehm_11', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Kinh Sách Phật Học Thích Thiện Hoa
Tự Hành Tọa Thiền Lìa Ấm Ma
Tự Thông Phi Hành Vô Lượng Cảnh
Quyết Tìm Thân Phụ Mãi Chẳng Ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_7gs9t_12', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đại Duyên Ngoạ Thiền Hiện Đám Tang
Chính Ngày Đại Lễ Phụ Thân Tan
Tự Giác Phụ Thân Hằng Bất Tử
Hội Ngài Tọa Thiền Quán Âm Trang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_3c09r_13', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Ngộ Thời Tâm Thức Đoạn Bất An
Tọa Thiền Buông Cảnh Dạo Mộng Nhàn
Kim Quang Trùm Khắp Phi Phi Tưởng
Bất Khả Rõ Ta Bất Rõ Đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_jt3xu_14', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Tam Thập Nhị Thọ Kỳ Duyên Thời
Ngộ Đạo Hái Điều Tổ Khai Lời
Đại Duyên Hội Tổ Bổn Mệnh Thức
Rõ Mình Vô Vật Tịnh Tam Thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_uffvd_15', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Ngự Tại Bản Thể Hành Muôn Nơi
Mặc Cảnh Thuận Nghịch Hoài Thảnh Thơi
Quá Khứ Vị Lai Tự Thông Tỏ
Tôn Tử Khẩn Cầu Khắp Nơi Nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_oay2t_16', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Chư Thiên Bồ Tát Đồng Gia Hộ
Cảnh Đời Tài Vật Tự Thông Lộ
Gia Đình Hoàn Tất Nhiệm Nhân Thế
Nhất Lòng Trợ Duyên Vô Hóa Độ', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_vvf40_17', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Cảm Niệm Phật Tổ Chư Thiên Hộ
Tam Vô Rõ Khứ Chẳng Tham Độ
Bao Đời Lệ Giọt Chư Phật Chứng
Chúng Luôn Chấp Niệm Dù Liễu Vô', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_i601k_18', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Bổn Nguyện Đại Chúng Cùng Chư Thiên
Tam Thập Ngũ Thọ Dạo Tùy Duyên
Lưu Tóc Y Thường Như Đại Chúng
Vô Tự Kinh Phổ Đoạn Đảo Điên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_2xamf_19', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Duyên Thời Đại Dịch Phát Chung Niên
Ứng Thân Nhiễm Độc Tách Cư Riêng
Chúng Sanh Tử Nạn Vô Số Kể
Thuốc Than Chẳng Dụng Tự Du Thiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_0eetj_20', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Sanh Lão Bệnh Tử Tứ Đại Không
Hướng Nhãn Thượng Thiên Vấn Hư Không
Nhược Tử Chư Phật Thập Phương Tử
Há Hãi Hiện Thân Hoại Diệt Ư', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_aawkw_21', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Bởi Chư Đại Chúng Khẩn Vô Trụ
Thỉnh Thân Trú Xứ Hóa Thành Dụ
Hiện Thân Hảo Trạng Dạo Tam Giới
Hóa Độ Quần Sanh Đáo Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_jscmb_22', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đại Duyên Lôi Âm Lộ Cổ Gia
Bác Hồi Quy Xứ Rõ Thân Ta
Lôi Chấn Âm Vang Cai Ngục Hoảng
Phá Tan Cai Ngục Tự Rõ Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wo674_23', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Đại Duyên Cách Ly Chốn Ta Bà
Trụ Vì Đại Chúng Đảnh Nở Hoa
Thanh Liên Vạn Cánh Lung Linh Sáng
Rõ Nhiệm Dẫn Chúng Đáo Quê Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_c8m91_24', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Nhất Nhật Nhất Nguyệt Xuân Giáp Thìn
Đại Duyên Xuống Tóc Đại Chúng Nhìn
Tùy Duyên Hóa Độ Nhân Tha Thiết
Khai Rõ Đoạn Mê Kiến Tánh Mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_bf57c_25', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Tạm Ngụ Châu Đức Thổ Long Gia
Lệnh Ban Trụ Sở Chính Biên Hòa
Đồng Nai Hữu Viện Tự Thập Xích
Hành Y Phá Tự Thoát Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_xxter_26', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Muôn Thời Tiếp Nối Dòng Thích Ca
Hữu Duyên Phá Độ Chúng Thoát Ra
Dạo Hành Thuận Nghịch Thong Dong Phá
Tam Giới Vỡ Tan Đáo Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_w6gea_27', '66687b37-b6d6-4936-a2e0-07127e4e6f52', 'Ai Duyên Giác Ngộ Tự Rõ Ta
Vô Hình Vô Vật Tự Quy Gia
Kiến Văn Giác Pháp Vô Tâm Vướng
An Nhiên Tự Tại Dạo Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.749Z', '2026-06-16T03:08:15.749Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_jjk8q_0', '5c5951aa-7547-4de1-81ea-e506a0cc2468', 'Cờ tựa tâm ý khởi lên
Ức do dính mắc lênh đênh sáu đàng
Khế hợp hôi thúi khắp làng
Bao đời ôm giữ hỏi người Nặng không', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.758Z', '2026-06-16T03:08:15.758Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_xlmj9_1', '5c5951aa-7547-4de1-81ea-e506a0cc2468', 'Cờ Ức Nặng Cực lông bông
Cố ôm cố giữ cố còng đống phân
Tưởng thơm lại thúi hóa đần
Muốn hết cực khổ hỏi mần cách chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.758Z', '2026-06-16T03:08:15.758Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_a9jfz_2', '5c5951aa-7547-4de1-81ea-e506a0cc2468', 'Gặp Vị khai chỗ Bất Nghì
Nhận ra bản thể hết đi lòng vòng
Dù cho cảnh Cực có còng
Thấy nghe nói biết rõ Không dính gì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.758Z', '2026-06-16T03:08:15.758Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_mljg1_3', '5c5951aa-7547-4de1-81ea-e506a0cc2468', 'Dòng đời thuận nghịch cứ đi
Vô tâm đối cảnh Cực gì cũng an
Vô khai Đạo Cực sống nhàn
Ai duyên tỏ ngộ lên đàng Cực Vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.758Z', '2026-06-16T03:08:15.758Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_7qyj1_0', '106bb32f-681d-4690-b8dc-f05cf3e30666', 'Xẻ thịt moi ruột rồi lột da
Chiên xào nấu nướng mặc khóc la
Hương thơm vị ngọt nhai ngấu nghiến
Chôn chúng nghĩa địa nơi bụng nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.763Z', '2026-06-16T03:08:15.763Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_hwa6c_1', '106bb32f-681d-4690-b8dc-f05cf3e30666', 'Gãy xương đứt tay đã khóc la
Thử hỏi món ấy vật chính ta
Lòng người an lạc hay đau đớn
Ai duyên dừng lại sạch bụng nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.763Z', '2026-06-16T03:08:15.763Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_hq1q0_2', '106bb32f-681d-4690-b8dc-f05cf3e30666', 'Rau củ hoa quả chẳng khóc la
Hiện diện cõi đời hợp thân ta
Ăn uống thanh đạm vô số món
Thân khỏe Tâm An dạo Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.763Z', '2026-06-16T03:08:15.763Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_eopw5_0', 'f4cd26e6-525b-48fd-a75c-1eda1776627f', 'Đánh chuông gõ mõ không âm
Niệm Phật trì chú âm câm rõ mình
Thấy nghe nói biết hằng minh
Hành không dính mắc tụng kinh không lời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.769Z', '2026-06-16T03:08:15.769Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_h473u_1', 'f4cd26e6-525b-48fd-a75c-1eda1776627f', 'Ai ơi đang sống ở đời
Đánh chuông gõ mõ muôn thời tỉnh ra
Niệm Phật Trì Chú rõ Ta
Tụng kinh mọi lúc mới là Đạo Như', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.769Z', '2026-06-16T03:08:15.769Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_l9spa_2', 'f4cd26e6-525b-48fd-a75c-1eda1776627f', 'Đánh chuông tỉnh thức lìa hư
Gõ mõ lợi nói ngôn từ thật chân
Niệm Phật Trì Chú rõ Thân
Tụng kinh hành đúng mười phân an nhàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.769Z', '2026-06-16T03:08:15.769Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_30bk4_3', 'f4cd26e6-525b-48fd-a75c-1eda1776627f', 'Ai duyên liễu ngộ rõ ràng
Hành ngay mọi lúc mọi đàng mọi nơi
Đời người sẽ mãi thảnh thơi
Đến khi duyên hết một đời về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.769Z', '2026-06-16T03:08:15.769Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_vvwut_0', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Nhân sinh quang chốn hồng trần
Vũ trụ quang mãi xoay vầng không thôi
Muốn không cuốn hút kéo lôi
Hiểu biết thật rõ về ngôi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_pzuac_1', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Biết rõ tánh Phật tánh Ma
Quy luật vạn vật biết mà không mê
Hành không dính mắc rõ quê
Giác Ngộ Giải Thoát liền về Phật xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_617rk_2', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Cũng bởi đại chúng cứ ưa
Nay Vô nói rõ tánh xưa của mình
Thấy Nghe Nói Biết hằng minh
Ý hằng thanh Tịnh quanh mình điện quang', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_mh8p4_3', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Ai mà vẫn cứ mơ màng
Âm dương cuốn hút mở đàng tánh nhân
Khiến cho vạn vật xoay vầng
Hồi về chốn cũ mãi đần nơi đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_dyoe1_4', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Nhân tố tương tác mỗi ngày
Tạo ra kết quả lại bày nhân duyên
Địa cầu vạn chúng đảo điên
Sáu loài một chỗ đem phiền cho nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_8jzb1_5', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Kẻ mạnh thì thích làm màu
Tạo hiện tượng lạ dính vào sẽ mê
Như Lai thuyết Pháp chỉ Quê
Tùy duyên Phật Pháp rõ bề trước sau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_18buq_6', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Bản thể Phật chẳng chút màu
Phán Ngài nói Pháp khác nào chửi ông
Phán Ngài không nói cũng ngông
Vậy là chê Pháp mà Ông đã dùng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ese4i_7', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Phá tướng vô tướng hết khùng
Còn không lại Tưởng sinh ngàn tam thiên
Rồi lại đi làm kẻ điên
Phải tìm đường thoát hết phiền mà tu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_j7ipu_8', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Dụng công hành pháp càng ngu
Âm dương sinh khởi hỏi sao thoát sình
Muốn được bất tử bất sinh
Lậu tận Phật Tổ trí bình đẳng Như', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_x8uo4_9', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Biết thông rõ hết mệt đừ
Sống không phiền não hữu dư niết bàn
Tứ đại ngũ uẩn đều tan
Trở về quê cũ niết bàn vô dư', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_dr8p3_10', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Hỏi ai hiểu rõ Phật Chư
Cả đời ngài chẳng một từ độ ai
Ai duyên thấy rõ Như Lai
Từ nào diễn tả chổ ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_uwq5m_11', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Tự người thấy Tánh ngay ta
Thấy Nghe Nói Biết vốn là Chân Như
Luân hồi muôn kiếp mệt đừ
Cũng vì Ngu muội Tánh Như Không cầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_9bt49_12', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Muốn được giải thoát cõi sầu
Phá Ngu thấy rõ biết mình Như Như
Biết rõ Tâm cũng huyển hư
Chỉ là hội tụ tạo từ các duyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_oo9l1_13', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Biết rõ Tánh người đảo điên
Bản chất Nhân Tánh chẳng yên bao giờ
Khiến cho vạn chúng mê mờ
Cầu siêu cúng lạy tôn thờ Bà La', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_xvegq_14', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Tin lầm lại dính đường Tà
Tránh mê tự rõ Chánh là ở đâu
Không mê dị cảnh lạy cầu
Cực đoan cúng bái khổ đau ngàn đời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_6uitq_15', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Luôn hành Tự Tánh ở đời
Sống không dính mắc sinh liền đức công
Hành thiện không đợi không mong
Tạo nhiều phước đức mạng xong về trời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_f6dpa_16', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Hành thiện còn tính lãi lời
Sinh ra âm đức phước về nhân gian
Sống mà sai trái dối gian
Hại người mình lại về đàn ác phương', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_nrkow_17', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Bỏ ngay năm Pháp lạc đường
Hành Pháp Giải Thoát về phương Phật Đà
Muốn Hành người phải rõ Ta
Rõ Tâm rõ Tánh rõ Nhà Ở đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_7dmzo_18', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Nhân sinh quang vốn khổ sầu
Vũ trụ quang vốn tạo màu trầm luân
Muốn tu thoát cảnh gian truân
Hành ngay Tôn Chỉ thoát luân hồi liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_vnys1_19', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Lâm chung Công Phước bằng nguyên
Hét lên một chữ Buông liền Phước tan
Khi cúng thần quỷ đến ăn
Người xong rồi đến súc sanh địa ngục', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_5zili_20', '590c11e2-b3f7-4349-ac52-61e33090b762', 'cỏ cây cũng hưởng ít cục
Ai duyên tự biết cúng gì cho ai
Chúng sanh sinh tử dài dài
Cũng vì ma tánh nổi hoài cuốn trôi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_2ozdp_21', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Tham ăn lười biếng nằm ngồi
Đến khi đói khác đủ điều cầu xin
Bị lừa mà vẫn cứ tin
Cũng vì hai chữ Tham Lam quá lầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_3bmpu_22', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Âm dương điện tử đột thay
Muôn vạn bóng ảo sanh ngay thân người
Run sợ lo lắng đủ đường
Ngu lầm thượng đế ổng thương mà cầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_375nq_23', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Đức Phật đã lập đạo màu
Giác Ngộ Giải Thoát hãy cầu mà đi
Về nơi Phật Giới bất nghì
Điện từ quang bủa bao trùm càn khôn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_86mjt_24', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Âm dương chẳng thể hút ôm
Chính là quê cũ mười phương Phật chờ
Đừng ham Tam Giới mê mờ
Âm dương cuốn hút mệt đờ chuyển luân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wdgvy_25', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Luân hồi muôn kiếp gian truân
Vô lượng tam giới chẳng buông thứ gì
Lỡ gieo ác nghiệp tức thì
Đọa vào hỏa ngục a tỳ tỷ năm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_jenkg_26', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Hỏa ngục không chỉ tại tâm
Mà còn ở chốn địa tâm cõi này
Lỡ làm đại ác bị đày
Làm loài hoa báu biết ngày nào ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_y6xzr_27', '590c11e2-b3f7-4349-ac52-61e33090b762', 'Nay Vô lại nói ba hoa
Ai duyên liễu ngộ nhận ra lối về
Nguyện cho đại chúng hết mê
Sống không dính mắc được về Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.774Z', '2026-06-16T03:08:15.774Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_e57zq_0', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Từ khi cất tiếng chào đời
Gặp trùm lừa đảo muôn thời dụ ta
Lừa ta hết khóc hết la
nói rằng ai khóc là ma tới tìm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_33u7y_1', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta bú sữa nằm im
Nói rằng không bú hắn tìm người cho
Lừa ta biết lật biết bò
Nói rằng như thế là trò đua xe', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_qj23u_2', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta mặc tả để tè
Nói rằng không mặc ngoài hè Kẹ thăm
Lừa ta nói đúng phát âm
Nói rằng âm lệch là hàm lệch theo', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_lb5mz_3', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta biết đứng biết đi
Nói rằng đi đứng được thì cho bay
lừa ta ăn uống no đầy
Nói rằng hắn đã no rồi cho ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wvqbg_4', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta ngủ nghỉ sớm nha
Thế mà hắn thức la cà khuya lơ
Lừa ta ăn uống đúng giờ
Thế mà hắn giảng tối mờ mới ăn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_qrrfi_5', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông hết tham lam
Thế mà hắn độ vô vàng chúng sinh
Lừa ta Buông hết bực mình
Thế mà hắn mắng đệ huynh còn lì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_8ij0k_6', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông hết ngu si
Thế mà hắn cứ hỏi khi chỉ Nhà
Lừa ta Buông bỏ cái Ta
Thế mà hắn nhận là Cha muôn người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ny2iz_7', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông hết nghi ngờ
Thế mà hắn chẳng tin vào chúng sanh
Lừa ta Buông ác sống lành
Thế mà hắn chẳng phóng sanh ra ngoài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_j9b99_8', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông kiến chấp hoài
Thế mà hắn chẳng nghe lời của ta
Lừa ta Buông bỏ tài ma
Thế mà hắn có cái Nhà Thất to', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_x6evw_9', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông sắc không theo
Thể mà hắn để Nữ đeo quanh mình
Lừa ta Buông thọ thoát sình
Thế mà hắn nói hắn hoài an vui', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_iloko_10', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông tưởng hết đui
Thế mà hắn biết ta vui hay buồn
Lừa ta Buông hết hành suông
Thế mà hắn nói hành chuông muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_3a8wq_11', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta Buông kiến thức đời
Thế mà hắn nhớ từng lời của ta
Lừa ta Buông bỏ danh ma
Thế mà ai cũng gọi Cha hắn cười', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_b8iqn_12', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lừa ta ăn đúng loài người
Thế mà hắn lại được ngồi ăn cao
Lừa ta ngủ nghỉ nhiều vào
Thế mà hắn thức ngày nào cũng khuya', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_a1wg9_13', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lời hắn cứ nói tía lia
Mà sao bao kẻ thoát lìa bất an
Lời hắn cứ nói oang oang
Mà sao bao kẻ nhẹ nhàng lắng nghe', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_321zy_14', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lời hắn xỏ lá ba que
Mà sao bao kẻ chịu nghe liền mừng
Lời hắn nói rất thẳng thừng
Mà sao bao kẻ rất ưng trong lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_73y37_15', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Lời hắn cứ hỏi lòng vòng
Mà sao bao kẻ nghe xong tỉnh liền
Lời hắn vọng ngữ luyên thuyên
Mà sao bao kẻ an yên hết sầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_5ofua_16', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Chắc là bùa ngãi nhiệm màu
Hắn dùng dụ dỗ khổ đau không còn
Chắc là lời ngọt lời ngon
Hắn dùng dụ dỗ viên tròn đức công', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_q78vw_17', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Ai mà đang khổ lòng vòng
Đừng dại gặp hắn cái còng mất tiêu
Ai mà tâm trạng rối nhiều
Đừng dại gặp hắn sẽ yêu hắn liền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_0oacs_18', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Ai mà rối rắm ưu phiền
Đừng dại gặp hắn bị yên muôn thời
Ai mà đầu óc rối bời
Đừng dại gặp hắn cả đời đầu an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_6c1o5_19', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Ai mà khổ cực than van
Đừng dại gặp hắn rõ đàng sướng vui
Ai mà cứ mãi lui cui
Đừng dại gặp hắn biết mùi thong dong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_46fim_20', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Ai mà muốn hết lông bông
Đừng dại gặp hắn bị không luân hồi
Ai mà muốn rõ Phật Ngôi
Đừng dại gặp hắn Phật ngồi ngay ta', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ipe25_21', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Dù gặp người có nhận ra
Biết rõ được hắn hay là tưởng chi
Gặp được mà vẫn sinh nghi
Tự người hãy hỏi lợi gì hắn đây', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_f0g3d_22', 'f682014f-3324-40a2-afb9-0bfaa515dd0e', 'Nay Vô nói gió nói mây
Ai duyên liễu ngộ rõ ngay Hắn liền
Nguyện Cho đại chúng hết phiền
Sống không dính mắc về miền Quê Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.784Z', '2026-06-16T03:08:15.784Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_0st0v_0', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Xa Quê vạn kiếp quên Nhà
Tham mê dính mắc ta bà trôi lăn
Tỷ đời tỷ kiếp lăn xăng
U mê tăm tối cứ ăn khổ sầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_uxvuq_1', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Ham mê dính mắc đau đầu
Than thân trách phận rồi cầu tứ phương
Bao giờ tìm thấy rõ đường
U mê lạc lối lầm đường bước sai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_bouuv_2', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Ngàn đời ngàn kiếp trôi hoài
Sầu bi khổ não lạc Ngai Phật Đà
Đại duyên gặp Vị độ tha
Được khai bổn tánh rõ Nhà mình đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_j227l_3', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Thấy mình chẳng có khổ sầu
Ở yên Bản Thể biết đâu quê Nhà
Chỉ cần biết rõ Phật Đà
Vô hình vô vật ở Nhà mình ngay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_iifeo_4', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Đừng ham dính mắc sa lầy
Nhớ hành tinh tấn sớm ngày về Quê
Đừng ham dính chấp rồi mê
Trôi lăn lặn ngụp biết về nơi đâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_m67m8_5', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Bây giờ biết cách thoát sầu
Ở yên bản thể chẳng cầu thứ chi
Thấy nghe nói biết không nghi
Hành không dính mắc để đi về nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_gs1vf_6', '3486ffb9-144e-49e2-afe4-a868795e1d90', 'Nguyện cho con cháu ta bà
Kiếp này viên mãn về nhà Như Lai
Nguyện cho đại chúng không sai
Công Hạnh viên mãn về ngai Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.791Z', '2026-06-16T03:08:15.791Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_hyegx_0', 'dfff23e8-9457-4239-9554-da5d318c0545', 'Ái Tình Tam Thế Vi Hà Khổ
Nhân Vị Ái Kỷ Bất Thấu Đỗ
Đại Bi Chân Ái Độ Tha Chúng
Bình Đẳng Muôn Loài Phúc An Viên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.797Z', '2026-06-16T03:08:15.797Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_y6322_1', 'dfff23e8-9457-4239-9554-da5d318c0545', 'tam thế: càn khôn, tam thiên đại thiên thế giới
tình ái (yêu thương) trong càn khôn này vì sao khổ?
nguyên nhân vì yêu bản thân -> không hiểu biết,
đỗ: đổ thừa, đổ vỡ, đổ - té ngã, đỗ đạt (thấu đạt, ko dc gì hết,  ko thấu đạt đc chân lý), bến đỗ - bến bờ giác ngộ
vì ko hiểu biết nên gặp gì cũng đổ lỗi cho nhau,...
chân ái: tình yêu chân thật: phải đại bi - yêu trùm khắp ko có gì cho mình, ko phân biệt - muôn loài như nhau, mới có thể độ tha chúng (đưa đại chúng qua bờ giác ngộ) được, mới tới dc chỗ muôn loài an lạc, hạnh phúc tới chỗ viên tròn.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.797Z', '2026-06-16T03:08:15.797Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wve13_0', '640d4402-e0f0-47a1-ac02-f65f0aeea36b', 'Bổn Nguyện Đại Chúng Thỉnh Xá Lợi
Như Lai Thị Hiện Rải Muôn Nơi
Hữu Duyên Liễu Nhận Thông Bổn Tánh
Vô Vật Bất Nhiễm Lạc Muôn Thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.805Z', '2026-06-16T03:08:15.805Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_iuryn_1', '640d4402-e0f0-47a1-ac02-f65f0aeea36b', 'Bổn nguyện của tất cả chúng sanh: là đều đến chỗ giải thoát ra khỏi tam giới. vì bổn nguyện đó tất cả mới thỉnh 10 đời chư phật rải xá lợi tất cả mọi nơi
Xá lợi: - lợi là lợi lạc, xá: nhận được những gì lợi lạc thì cung kính, trân quý. những điều lợi lạc đáng cung kính dc gọi là xá lợi - giống như những viên ngọc quý. (hình tướng thôi) Những gì 10 đời chư Phật hoặc đạo nhân vtvc khai thị cho chúng sanh chính là ngọc quý
rải muôn nơi: đi tới đâu hữu duyên tới đâu gieo tới đó. rải - vô lượng xá lợi nên ‘rải’.
ai có duyên nhận và liẽu ngộ dc thì thông tỏ bổn tánh.
Thông Bổn Tánh: thông là ko còn kẹt, bổn tánh nơi bao gồm tất cả các tánh, trong đó có tánh phật tánh người tánh ma -> thông tỏ hết tất cả các tánh, không còn bị dính mắc hay kẹt vào tánh nào hết.
bổn tánh ko hình ko vật thì ko nhiễm gì hết, an lạc muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.805Z', '2026-06-16T03:08:15.805Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_404nd_0', '52404987-d31b-4a2e-93f1-a087a5d62e2d', 'Cổ Kim Tôn Tử Lạc Phương Xa
Hữu Duyên Đại Ngộ Quy Nhất Gia
Vô Ngã Vô Niệm Kim Vô Tướng
Nhất Dạ Đồng Tâm Đáo Phật Đà
xưa tới nay các con đi lạc nhà vừa lâu vừa xa, trong tam giới này mỗi đứa 1 nơi cũng xa nhau. trc khi gặp cha thì ko nhớ dc mình, cũng ko hề nhớ đây là ng nhà. có duyên được đại ngộ, các con quay về 1 Nhà. Nhà ở đây có nhà thế gian và xuất thế gian là ngôi nhà Phật giới.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.814Z', '2026-06-16T03:08:15.814Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ufe3f_0', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Sống trong cõi tạm Ta Bà
Tạp cư ngũ thú hỏi Ta thế nào
Đến nơi cõi tạm phải sao
Sống sao tự tại sống sao thoát phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_j7gij_1', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Cảm niệm Bồ Tát Chư Thiên
Kim Cang Hộ Pháp Long Thần giúp nhân
kim cang: mạnh mẽ,
hộ pháp:', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_a7gfm_2', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'long thần: vua các loại thần
Ai duyên nhận rõ Pháp Thân
Hành nơi Tự Tánh thoát trần về Quê
Cảm niệm Thần khắp tứ bề', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_z0qmc_3', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Giúp bao nhân thế chỉnh tề an gia
Giúp cho cuộc sống muôn Nhà
Công thành danh toại thuận hòa an khang
Cảm niệm Chư Thần thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_0qz04_4', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Tạo bao duyên cảnh họ hàng an vui
Giúp nhau thoát cảnh lui cui
Thân bằng quyến thuộc đều vui trong lòng
* lúc nào  cũng ở yên tự tnahs biết không ai chửi dc mình ai nói gì mình mình cũng hề hề là cuối cùng mọi người cũng đều an vui hạnh phúc', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_4r2tm_5', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Cảm niệm Thần Núi Thần Sông
Thần đất Thần nước Thần Phong Hỏa Thần
Thổ Công cho đến Thần Hoàng
Cảm niệm chư vị bảo an muôn người', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_h1cqf_6', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Cảm niệm Thần Lộc Thần Tài
Giúp bao nhân thế gặp may phước nhiều
Thổ Địa Ông Táo Ông Công
* thổ địa: coi đất tại nhà, ông công: coi đất tại khu vực đó, ông táo (3 ông) cai quản việc bếp núc, nhà cửa. bếp để nấu đồ ăn, -> bụng no nê, bếp là nơi tạo ra lửa, sinh khí ấm áp cho cả nhà, cúng ông táo để gia đình vừa ấm vừa no. sự tích các ông cưỡi cá chép lên trời báo cáo ông trời. mình làm gì thì mình đều biết hết. một năm trời quán chiếu lại làm những việc tốt sai thiện ác, ai báo cáo? chính bản thân mình. tại sao ko cúng cá khác mà lại cúng cá chép? chép là ghi chép, tự ghi chép lưu trữ lại. một năm làm những gì thì đều lưu trữ hết lại trong a lại đa thức hết . 2 ông hạng hạnh khiển và phán quan. tâm phân biệt chính là ông trời của các con, vừa quan sát vừa phán đúng sai tốt xấu để điều khiển cơ thể này sống làm sao cho đức hạnh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_nsf7t_7', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', '* Giúp người đầm ấm lửa hồng nhà an
Cảm niệm Hạnh Khiển Phán Quan
Giúp người sống đúng rõ ràng không sai
Cảm niệm tất cả các Ngài', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_idoja_8', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Luôn hành sứ mệnh quản cai ta bà
Cảm niệm Thần Thánh quanh Ta
Luôn hành sứ mệnh Nhà Nhà an yên
Nguyện cho Thần Thánh khắp miền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_pl1jc_9', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Hoàn thành sứ mệnh mãn viên an nhàn
Ai duyên liễu ý rõ ràng
Chư Thiên Thần Thánh một đàng như Ta
Buông Danh Tướng Tự ngộ ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_wqvfn_10', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Cúng Chư Thần Thánh hóa ra cúng mình
Hữu duyên người sẽ tỏ minh
Sống không dính mắc chẳng sinh não phiền
Thân tâm đối cảnh tùy duyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ij3lk_11', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Không va kết quả an nhiên muôn thời
Mượn thân tạm sống ở đời
Biết ơn Thần Thánh mọi nơi giúp mình
Duyên nay bày tỏ tâm tình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_ie4xh_12', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Chư Thiên Thần Thánh chứng minh tấm lòng
Nguyện cho Chư Vị thong dong
Hoàn thành sứ mệnh sống không não phiền
Nguyện người hữu phúc hữu duyên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162360_71p9t_13', '2ed9837b-49d4-4b19-86e4-aab0527b5aea', 'Tìm lại bản thể hằng yên nơi mình
Nguyện cho đại chúng hằng minh
Sống không dính mắc tử sinh không màng
Nguyện cho đại chúng rõ ràng
Bồ đề viên mãn trên đàng Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.821Z', '2026-06-16T03:08:15.821Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_x1ued_0', '47b26eb9-3fd0-4b3d-99b7-49a11e5aa02e', 'Đại duyên ngày lễ quý Bà
Tam Vô gửi tặng ngọc ngà Vô Sanh
Nguyện cho quý Mẹ tịnh thanh
Không còn khổ não loanh quanh cõi này', 'I. MÓN QUÀ "NGỌC NGÀ VÔ SANH"
Thế gian tặng nhau hoa hồng, kim cương, nhưng Sư Cha tặng "Vô Sanh".
Ngọc ngà: Là sự trân quý, sáng trong.
Vô sanh: Là bản thể không sinh không diệt. Khi nhận ra bản thể này, người phụ nữ sẽ không còn bị lay động bởi những thăng trầm của số phận, không còn khổ vì chồng, vì con, vì những ràng buộc của thân phận nữ nhi.
II. LỜI NGUYỆN CHO TỪNG THÂN PHẬN
Sư Cha dùng đại từ bao quát mọi lứa tuổi, mọi vai trò của người phụ nữ trong xã hội để phát lời nguyện giải thoát:
Quý Mẹ, Quý Mợ: Những người thường mang nặng nỗi lo gia đình, lặn lội trong "bùn lầy" của cơm áo gạo tiền. Nguyện cho họ được "tịnh thanh", thoát khỏi cảnh "đày" của sáu nẻo luân hồi.
Quý Cô, Quý Dì: Nguyện cho họ "rõ đường", thoát khỏi mê lầm để quay về với bến đỗ của mười phương chư Phật.
Quý Chị, Em Gái: Nguyện cho họ "hằng minh", sống tỉnh thức ngay nơi Tự Tánh để hưởng sự thanh nhàn, tự tại giữa dòng đời vạn biến.
III. TÔNG CHỈ: GẶP HAY KHÔNG GẶP ĐỀU GIẢI THOÁT
Đây là lòng từ bi bao la của bậc Đạo Nhân. Không cần phải gặp mặt thân xác, chỉ cần tâm hướng về sự thật, năng lượng thanh tịnh sẽ tự kết nối:
Người chưa thấy đường: Hãy phát tâm cầu học, tìm về sự tỉnh thức.
Người đã thấy đường: Hãy sống trọn vẹn với sự tỉnh thức đó, an nhiên tự tại, không còn bị cuốn vào vòng xoáy của buồn vui thế tục.
IV. LỜI NHẮC CỐT TỦY
Người phụ nữ thường dễ bị "tình ái" và "trách nhiệm" làm cho đảo điên, ưu phiền. Bài kệ nhắc nhở Quý Bà, Quý Cô rằng: Quê Hương thật sự không nằm ở một mái ấm vật lý, mà nằm ngay nơi "Tự Tánh hằng an". Khi trở về được Nhà Xưa, mọi khổ não sẽ tự tan biến.
Gửi đến tất cả những người phụ nữ đang hiện diện: Dù Quý Vị đang mang vai trò gì, hãy nhớ rằng bên trong Quý Vị luôn có một viên "Ngọc Ngà Vô Sanh" đang tỏa sáng. Đừng mải mê tìm kiếm hạnh phúc bên ngoài mà quên mất kho báu ngay nơi chính mình.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.828Z', '2026-06-16T03:08:15.828Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_feol3_1', '47b26eb9-3fd0-4b3d-99b7-49a11e5aa02e', 'Nguyện cho quý Mợ hết lầy
Không còn lặn lội thoát đày sáu phương
Nguyện cho quý Cô rõ đường
Không còn sanh tử Phật phương trở về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.828Z', '2026-06-16T03:08:15.828Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_4fc51_2', '47b26eb9-3fd0-4b3d-99b7-49a11e5aa02e', 'Nguyện cho quý Gì thoát mê
Luôn thường an lạc nơi Quê Hương mình
Nguyện cho quý Chị hằng minh
Muôn thời tỉnh thức bất sinh rõ đàng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.828Z', '2026-06-16T03:08:15.828Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_7rc10_3', '47b26eb9-3fd0-4b3d-99b7-49a11e5aa02e', 'Nguyện cho Em Gái hằng an
Sống nơi tự tánh thanh nhàn muôn nơi
Đại duyên Vô gửi mấy lời
Nguyện cho Phụ Nữ muôn thời an yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.828Z', '2026-06-16T03:08:15.828Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_6de8a_0', '8ea60bd4-4933-40b3-b710-9f1a3e50160f', 'Xuân Đến Xuân Đi Xuân Lại Đến
Cũng như mấy độ Hạ Thu Đông
Người ơi có cần phải ngóng trông
Sống Sao cho Xuân mãi trong lòng', 'Phân tích bài kệ “Xuân”
1.
Xuân đến xuân đi xuân lại đến
Cũng như mấy độ Hạ Thu Đông
Xuân đến rồi đi, rồi lại đến – đó là luân hồi, là vô thường. Cũng như Hạ – Thu – Đông – tất cả đều thay đổi, không bền, không có gì nắm giữ được.
2.
Người ơi có cần phải ngóng trông
Sống sao cho Xuân mãi trong lòng
Đa phần mọi người trông đợi mùa xuân, vì thời tiết dễ chịu, vì được nghỉ ngơi, ăn Tết, sum vầy bên người thân, thoát khỏi công việc bận rộn. Nhưng mùa xuân đó chỉ là cảnh bên ngoài, cũng vô thường, rồi sẽ qua.
Điều quan trọng là làm sao để xuân luôn ở trong lòng, ngay nơi mình, không đợi chờ cảnh đến nữa.
3.
Chỉ cần không đắm tham cùng luyến
Muốn sống mãi trong “xuân” thì chỉ cần không tham đắm, không luyến ái, không bị trói buộc bởi các cảnh tốt xấu.
4.
Cảnh trần hư huyễn hóa hư không
Hiểu rõ rằng cảnh trần chỉ là huyễn hóa, sanh diệt, có – không, tốt – xấu đều do tâm dính mắc mà sinh. Khi không dính, thì tất cả huyễn cảnh tự hóa thành hư không – tức không còn lực chi phối.
5.
Muôn thời muôn khắc Thanh cùng Tịnh
Nếu sống được như vậy, ở yên ngay bản thể, không chạy theo cảnh, thì mọi thời khắc đều thanh tịnh, dù là mùa nào cũng là Xuân.
6.
Chính là Xuân đó khỏi phải mong
Đó mới chính là mùa xuân đích thực, mùa xuân không đến không đi, không phải đợi mong gì nữa. Khi đã gặp được Cha, sống ngay nơi bản thể rồi – thì ngày nào, giờ nào cũng là mùa xuân.
Bài kệ này, Cha phá chấp cảnh trần, phá chấp cái gọi là tốt – xấu.
* Người đời thường bám chấp vào cảnh đẹp như mùa xuân, nghĩ rằng đó là hạnh phúc. Nhưng đó chỉ là biểu hiện vô thường, đến rồi đi.
* Chân xuân là xuân không sinh không diệt, không đến không đi, nằm ngay nơi tâm không đắm luyến.
* Chỉ khi lìa tham, lìa luyến, buông cảnh trần tốt xấu, mới thấy được mùa xuân vĩnh cửu ngay bản thể, không bị cuốn bởi thời tiết, hoàn cảnh, sự việc.
* Đó là sự tự tại, là sống với bản lai diện mục, chẳng đợi gì, chẳng cần gì – mà luôn xuân.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.834Z', '2026-06-16T03:08:15.834Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_4vixl_1', '8ea60bd4-4933-40b3-b710-9f1a3e50160f', 'Chỉ cần không đắm tham cùng luyến
Cảnh trần hư huyễn hóa hư không
Muôn thời muôn khắc Thanh cùng Tịnh
Chính là Xuân đó khỏi phải mong', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.834Z', '2026-06-16T03:08:15.834Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_44lbv_2', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Đại duyên Phật Đản cõi này
Trao truyền chánh pháp thoát lầy thế gian
Ai mà nhận được sẽ an
Luôn luôn tinh tấn an nhàn thảnh thơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_aunb5_3', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Ai ơi đang sống ở đời
Nhận được Tự Tánh chính lời Phật trao
Hành ngay sẽ thoát khổ đau
Thấy Nghe Nói Biết việc nào cũng thông', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_04qlu_4', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Đời người sẽ mãi thong dong
Không còn sanh tử long bông sáu loài
Đời người sẽ hết mệt nhoài
Ung dung tự tại sống hoài An Yên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_df4ng_5', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Đại duyên Phật Đản đưa thuyền
Dẫn đàn con cháu hữu duyên về Nhà
Con xin cảm niệm Phật Đà
Nguyện hành Chánh Pháp Thích Ca lưu truyền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_bu4l5_0', '51bf1630-03b3-4f68-af1b-7eb332f96217', 'Mừng xuân đón Tết khai niên
Nguyện cho nhân thế hết phiền lo âu
Ai duyên đều rõ mình Giàu
Nhận ngay ngọc quý bảo châu nơi mình', 'I. TẾT LÀ SỰ "THÔI" VÀ "BUÔNG"
Tết theo nghĩa thế gian là nghỉ ngơi, quây quần. Nhưng theo nghĩa Đạo, Tết là thời khắc Quý Vị "Thôi" chạy theo lục trần, "Buông" mọi lo toan tính toán để tận hưởng sự thanh tịnh vốn sẵn có.
Nếu tâm không buông, thì dù có ngồi giữa gia đình, Quý Vị vẫn đang "đi lạc" trong rừng sâu của ưu phiền.
II. CÁI "GIÀU" CỦA BẬC ĐẠO NHÂN
Người đời chúc nhau "Phát tài phát lộc", mong cầu tiền bạc bên ngoài. Sư Cha lại nguyện cho Quý Vị thấy mình "Giàu".
Cái giàu này không nằm ở ngân hàng, mà nằm ở viên "Ngọc Quý Bảo Châu" – chính là Tự Tánh thanh tịnh. Khi nhận ra mình vốn đầy đủ, không thiếu thứ gì, Quý Vị chính là người giàu nhất thế gian, vì không còn bị lòng tham cầu làm cho nghèo khổ.
III. HẾT TỬ HẾT SINH – XUÂN VĨNH CỬU
"Từ nay hết tử hết sinh": Khi Quý Vị nhận ra Bản Thể bất diệt, cái chết của thân xác vật lý chỉ như thay một chiếc áo cũ. Xuân này không còn là xuân của thời gian sanh diệt, mà là Xuân Vô Sanh.
"Trần gian bụi bẩn chẳng vương": Tự Tánh như hoa sen, dù sống giữa bùn lầy trần cấu (sắc, thanh, hương, vị, xúc, pháp) vẫn hằng thanh tịnh, không dây dính chút bụi trần nào.
IV. CON ĐƯỜNG VỀ "NHÀ CŨ"
Như Lai không ở đâu xa, "Nhà Cũ" chính là nơi Quý Vị đang đứng. Lời nguyện của Sư Cha là mong Quý Vị "tỏ rõ đường", không còn loanh quanh tìm kiếm bên ngoài mà hãy bước thẳng vào ngôi nhà Chân Như của chính mình. Đó mới là sự sum họp viên mãn nhất.
Chúc Quý Vị một cái Tết không chỉ có hoa mai hoa đào, mà có cả Hoa Khai Kiến Phật. Hãy nhận lấy viên ngọc quý nơi mình để mỗi bước chân đi giữa trần gian đều là bước chân dạo chơi trong cõi tịnh.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.839Z', '2026-06-16T03:08:15.839Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_zjokl_1', '51bf1630-03b3-4f68-af1b-7eb332f96217', 'Từ nay hết tử hết sinh
Trần gian bụi bẩn ngay mình chẳng vương
Nguyện cho người tỏ rõ đường
Như Lai nhà cũ người thường bước đi.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.839Z', '2026-06-16T03:08:15.839Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_ymnrm_0', '86114a57-9bb9-43bc-95d6-29f8d65b8462', 'Tân Niên Mừng Tết Đến Muôn Nơi
Nguyện Cho Nhân Thế Sống Thảnh Thơi
An Nhiên Tự Tại Nơi Bổn Tánh
Bất Tử Bất Sanh Lạc Muôn Thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.844Z', '2026-06-16T03:08:15.844Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_2ac2y_1', '86114a57-9bb9-43bc-95d6-29f8d65b8462', 'Mặc Kệ Dòng Đời Luôn Cuốn Hút
Nguyện Người Chẳng Vương Dù Một Chút
Hằng Giây Hằng Phút Sống An Nhàn
Người Người Hạnh Phúc Nhà Nhà An', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.844Z', '2026-06-16T03:08:15.844Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_8xhpk_0', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Bộn bề tần tảo quanh năm
Bao nhiêu phiền muộn âm thầm đeo mang
Trải qua nhiều cảnh trái ngang
Tết xuân buông hết lên đàng Về Cha', 'Phân Tích Chi Tiết Bài Kệ ''Tết Xuân''
Ý Nghĩa Sâu Sắc Về Đạo và Đời
Bài kệ "Tết Xuân" không chỉ miêu tả không khí vui tươi của ngày Tết cổ truyền mà còn ẩn chứa hai lớp nghĩa sâu sắc: một là cảnh đời thế gian, hai là con đường đạo Giác ngộ - Giải thoát. Sư Cha đã mượn những hình ảnh gần gũi, thân thuộc nhất để khai thị con đường trở về "Quê Nhà" chân thật, nơi mỗi ngày đều là mùa xuân vĩnh cửu.
Khổ 1-3: Từ Bỏ Trần Gian Mệt Mỏi, Quay Về "Quê Nhà" Sum Vầy
Bộn bề tần tảo quanh năm
Bao nhiêu phiền muộn âm thầm đeo mang
Trải qua nhiều cảnh trái ngang
Tết xuân buông hết lên đàng Về Cha
Vui xuân ở chốn Quê Nhà
Cả nhà rộn rã cùng Cha sum vầy
Ngày xuân Tết đến nơi này
Nào hoa nào liễn nào đầy đèn Xuân
* Lớp nghĩa đời thường: Sau một năm dài "bộn bề tần tảo," gánh chịu bao "phiền muộn," Tết là dịp để "buông hết" tất cả, trở về sum vầy bên gia đình, Cha Mẹ.
* Lớp nghĩa đạo:
* "Bộn bề tần tảo": Tượng trưng cho kiếp sống luân hồi, con người mãi chạy theo 16 thứ tánh người (tham, sân, si...), luôn tất bật trong khổ đau.
* "Về Cha" & "Quê Nhà": Chính là trở về với Bản thể, Tự Tánh thanh tịnh của chính mình. "Quê Nhà" không phải nơi chốn địa lý, mà là trạng thái an nhiên, tịch lặng ngay trong tự tâm.
* "Hoa, Liễn, Đèn Xuân": Đây là những biểu tượng vi diệu:
* Hoa: Tượng trưng cho những điều tươi đẹp, thiện lành.
* Liễn: Tượng trưng cho Pháp, những lời khai thị.
* Đèn: Tượng trưng cho trí tuệ Bát Nhã, là mẹ của các vị Phật
Khi trở về "Quê Nhà" Tự Tánh, ta trang hoàng ngôi nhà tâm linh của mình bằng vẻ đẹp, bằng chánh pháp và bằng trí tuệ.
Tại sao nói trí tuệ Bát Nhã là mẹ của các vị Phật? Trí tuệ Bát Nhã là ở ngay tự tánh mà thấy biết thấu suốt rõ ràng (quán: thấy, âm: nghe âm thanh, thế: nhân thế. Quán Thế Âm nghĩa là thấy biết thân thế một cách thấu suốt rõ ràng). Bát Nhã Tâm Kinh là của Quán Thế Âm Bồ tát để lại, trong đó ghi ‘Quán Tự Tại Bồ Tát hành thâm Bát nhã Ba la mật đa thời, chiếu kiến ngũ uẩn giai không, độ nhứt thiết khổ ách. Xá Lợi Tử, sắc bất dị không, không bất dị sắc, sắc tức thị không, không tức thị sắc, thọ tưởng hành thức diệc phục như thị..’ Ai mà nói ra được như thế, không còn là Bồ tát nữa. Cho nên chính vì vậy gọi Bồ tát là mẹ của các vị Phật. Bát Nhã Tâm Kinh là Quán Thế Âm bồ tát để lại. Ai mà hành đúng Bát Nhã Tâm Kinh, ở yên ngay tự tánh của mình thành Phật thì tức là Bát Nhã là mẹ của các vị Phật.
Khổ 4-6: Sự Tương Phản "Ngoài Kia" và "Về Quê"
Ngoài kia bao cảnh gian truân
Về quê có Tết có xuân muôn thời
Ngoài kia rối rắm cuộc Đời
Về quê vui Tết thảnh thơi an nhàn
Ngoài kia bươn chải điêu tàn
Về quê ăn Tết huy hoàng cùng Cha
Bao ngày khắp chốn bôn ba
Xuân về tết đến về Nhà liền an
Sư Cha đã vẽ nên một sự đối lập rõ rệt:
* "Ngoài kia": Là thế giới của vọng tưởng, của tánh ma, nơi con người đối mặt với "gian truân," "rối rắm," và "điêu tàn".
* "Về quê": Là trở về với Bản thể, nơi lúc nào cũng là "Tết có xuân muôn thời," là trạng thái "thảnh thơi an nhàn" và "liền an".
Bình an chân thật không thể tìm thấy ở thế giới bên ngoài mà chỉ có được khi ta quay về an trú nơi Tự Tánh của chính mình.
Khổ 7-11: Vạn Vật Hoan Hỷ Khi Chúng Sanh Tỉnh Thức
Cả Nhà ai cũng rộn ràng
Không còn những tiếng thở than buồn phiền
Từng bầy con cháu hồn nhiên
Vui xuân chạy nhảy khắp miền quê Cha
Trẻ con cho đến người già
Cắm hoa làm bánh làm quà cùng nhau
Dọn dẹp nhà cửa trước sau
Bàn thờ trang trí đủ màu Tết xuân
Trong nhà cho đến ngoài sân
Đâu đâu cũng có hoa xuân sắc vàng
Lũ chim ríu rít rộn ràng
Nhảy qua nhảy lại hót vang Tết rồi
Những con chó cũng bồi hồi
Thấy người về Tết ôi thôi chúng mừng
Cả đàn cá múa tưng bừng
Vui xuân ngày Tết không ngừng lượn quanh
Hoa xuân nở đẹp như tranh
Từng đàn bướm nhỏ lượn quanh vui đùa
Dù đời lắm cảnh hơn thua
Về quê đón Tết một mùa Thanh Xuân
Khi một người tỉnh thức, quay về Tự Tánh, thì không chỉ bản thân họ an lạc mà cả tam giới (trời, đất, nước) đều hoan hỷ.
* "Trong nhà cho đến ngoài sân": Nghĩa là từ trong tâm thức cho đến ngoại cảnh, tất cả đều bừng sáng.
* "Hoa xuân sắc vàng": "Sắc vàng" tượng trưng cho công đức vô lượng sinh ra khi sống trong Tự Tánh.
* Chim, Chó, Cá, Bướm: Tượng trưng cho vạn vật trong các cõi.
* Chim, bướm: Loài bay trên trời (thượng giới).
* Chó: Loài đi trên mặt đất (trung giới), tượng trưng cho lòng trung thành và sự kiên trì ("trì chú").
* Cá: Loài bơi dưới nước (hạ giới).
* "Một mùa Thanh Xuân": Chính là "Thanh Tịnh" và "Xuân". Khi về Quê Nhà, ta sống trong mùa xuân của sự thanh tịnh vĩnh cửu.
Khổ 12-15: Lời Dặn Dò Cốt Lõi - Chữ "Hiếu", Chữ "Dừng" và Bản Chất Thật Sự của Tết
Điều này người nhớ thấm nhuần
Đi đâu hãy nhớ ngày Xuân về Nhà
Mùng một là lễ Tết Cha
Mùng Hai Tết Mẹ mùng Ba Tết Thầy
Bon chen đừng để sa lầy
Ngày xuân Tết đến mà cày còng lưng
Duyên Xuân gửi tặng chữ DỪNG
Cảnh đời tốt xấu hãy DỪNG vọng va
Tết xuân là cảnh quê nhà
Dừng theo trần cấu về Cha sum vầy
Ai ơi hãy nhớ điều này
Quê xưa là Tết cả ngày tháng năm
Dù đi vạn dặm xa xăm
Nhớ hành Tự Tánh đừng nhầm Tánh Ma
Sống không dính mắc là Nhà
Dừng ưa Dừng luyến la cà thế gian
Tết là bản thể hằng an
Về nơi bổn tánh là đàng Tết Như
Vui xuân gửi tặng mấy từ
Ai duyên liễu nghĩa sống như Phật Đà
Nguyện cho nhân thế ta bà
Ngày nào cũng Tết ngay ta của mình
Nguyện cho đại chúng tỏ minh
Vô vật hằng Tết ngay mình hằng Xuân
Đây là những lời dạy cốt tủy nhất:
* Đạo Hiếu: "Mùng một Tết Cha, mùng hai Tết Mẹ, mùng ba Tết Thầy" là lời nhắc nhở quay về với cội nguồn tâm linh. Cha, Mẹ, Thầy chân thật chính là Bản thể Tự Tánh, là Trí Tuệ (Bát Nhã) - Mẹ của mười phương Chư Phật.
* Chữ "DỪNG": Đây là chìa khóa tu tập. "Dừng" là thôi chạy theo ngoại cảnh, thôi dính mắc vào tốt-xấu, khen-chê. Khi tâm "dừng" lại, ngay lập tức ta trở về với "Quê Nhà".
* Bản Chất Thật của Tết: "Tết là bản thể hằng an". Tết thật sự không phải là một dịp lễ theo mùa, mà là trạng thái an nhiên, tự tại khi sống trọn vẹn với Tự Tánh.
* Vô Vật Hằng Tết: Lời nguyện cuối cùng là mong cho đại chúng "tỏ minh," nhận ra mình vốn là "vô vật" (không hình không tướng). Khi đó, sẽ sống trong trạng thái "hằng Tết" và "hằng Xuân" ngay nơi chính mình.
Tổng Kết
Bài kệ "Tết Xuân" sử dụng hình ảnh gần gũi của ngày Tết để chỉ thẳng con đường trở về Bản thể chân thật. Hạnh phúc và an lạc vĩnh cửu không nằm ở những cảnh vui chóng tàn của thế gian, mà ở ngay trong "Quê Nhà" Tự Tánh của mỗi người. Bằng cách thực hành chữ "DỪNG" — dừng chạy theo vọng tưởng, dừng dính mắc vào trần cảnh — chúng ta có thể sống mỗi ngày trong mùa xuân bất diệt của sự Giác Ngộ và Giải Thoát.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_agk4i_1', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Vui xuân ở chốn Quê Nhà
Cả nhà rộn rã cùng Cha sum vầy
Ngày xuân Tết đến nơi này
Nào hoa nào liễn nào đầy đèn Xuân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_lg7jg_2', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Ngoài kia bao cảnh gian truân
Về quê có Tết có xuân muôn thời
Ngoài kia rối rắm cuộc Đời
Về quê vui Tết thảnh thơi an nhàn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_5whl8_3', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Ngoài kia bươn chải điêu tàn
Về quê ăn Tết huy hoàng cùng Cha
Bao ngày khắp chốn bôn ba
Xuân về tết đến về Nhà liền an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_6wta4_4', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Cả Nhà ai cũng rộn ràng
Không còn những tiếng thở than buồn phiền
Từng bầy con cháu hồn nhiên
Vui xuân chạy nhảy khắp miền quê Cha', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_k5sg7_5', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Trẻ con cho đến người già
Cắm hoa làm bánh làm quà cùng nhau
Dọn dẹp nhà cửa trước sau
Bàn thờ trang trí đủ màu Tết xuân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_crnj3_6', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Trong nhà cho đến ngoài sân
Đâu đâu cũng có hoa xuân sắc vàng
Lũ chim ríu rít rộn ràng
Nhảy qua nhảy lại hót vang Tết rồi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_82iyz_7', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Những con chó cũng bồi hồi
Thấy người về Tết ôi thôi chúng mừng
Cả đàn cá múa tưng bừng
Vui xuân ngày Tết không ngừng lượn quanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_1smnj_8', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Hoa xuân nở đẹp như tranh
Từng đàn bướm nhỏ lượn quanh vui đùa
Dù đời lắm cảnh hơn thua
Về quê đón Tết một mùa Thanh Xuân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_206u2_9', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Điều này người nhớ thấm nhuần
Đi đâu hãy nhớ ngày Xuân về Nhà
Mùng một là lễ Tết Cha
Mùng Hai Tết Mẹ mùng Ba Tết Thầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_t9fco_10', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Bon chen đừng để sa lầy
Ngày xuân Tết đến mà cày còng lưng
Duyên Xuân gửi tặng chữ DỪNG
Cảnh đời tốt xấu hãy DỪNG vọng va', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_msplt_11', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Tết xuân là cảnh quê nhà
Dừng theo trần cấu về Cha sum vầy
Ai ơi hãy nhớ điều này
Quê xưa là Tết cả ngày tháng năm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_mrykn_12', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Dù đi vạn dặm xa xăm
Nhớ hành Tự Tánh đừng nhầm Tánh Ma
Sống không dính mắc là Nhà
Dừng ưa Dừng luyến la cà thế gian', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_7hz2e_13', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Tết là bản thể hằng an
Về nơi bổn tánh là đàng Tết Như
Vui xuân gửi tặng mấy từ
Ai duyên liễu nghĩa sống như Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_8vx2b_14', 'c8a1828a-4a07-4bd7-b43f-e7c878e0cc54', 'Nguyện cho nhân thế ta bà
Ngày nào cũng Tết ngay ta của mình
Nguyện cho đại chúng tỏ minh
Vô vật hằng Tết ngay mình hằng Xuân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.859Z', '2026-06-16T03:08:15.859Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_hzxz0_0', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Mừng ngày Đại Lễ Phật Đà
Tái sanh xuất thế Ta Bà độ sanh
Giúp người đại phúc Vô Sanh
Giúp cho thế giới an lành thảnh thơi', '08/04 - QUÝ MÃO
Nam Mô Tổ Điều Ngự Đàm Hoa Chân Thật
Phân tích bài kệ "Kính Lễ Phật Đản" theo khai thị Sư Tam Vô
1.
Mừng ngày Đại Lễ Phật Đà – Tái sanh xuất thế Ta Bà độ sanh
Câu kệ mở đầu là lời kính lễ vị Phật hiện thế - vốn là người mang đại duyên đại phúc, tái sanh xuống cõi Ta Bà để độ sanh. Sự kiện này là vô cùng trân quý, vì các vị Phật thường trụ trị trong Phật giới chứ không ở lại cõi trần.
Giúp người đại phúc vô sanh
Chỉ những ai hội đủ đại phúc (do phước báo và công đức hội tụ) mới gặp được vị Đạo nhân vô tu vô chứng khai thị về chỗ vô sanh – lối thoát rốt ráo khỏi sanh tử.
Giúp cho thế giới an lành thảnh thơi
Khi một vị Phật xuất thế, họ giúp cho thế giới an lành như thế nào?  Không chỉ những người có đại phúc đại duyên được nhận lại con đường vô sanh được hưởng lợi, mà khi một vị Đạo nhân vô tu vô chứng xuất hiện thì toàn thế giới cũng được hưởng lợi.
Khi nào thì một vị Phật xuất thế?
Trong giai đoạn trái đất sau khai thiên lập địa, con người còn nhiều mê tín, chỉ biết lạy lề lạy pháp, sinh ra đạo thần, đạo linh, gây nhiều sân si đấu tranh. Càng về sau, con người càng khai thác khoáng sản, phát triển khoa học kỹ thuật đồng nghĩa với ô nhiễm, mất cân bằng âm dương – gây rối loạn năng lượng.
Chính lúc đó - khi thế giới rơi vào trạng thái mất cân bằng và bất ổn, vị Đạo nhân xuất thế, mang dòng điện từ quang thanh tịnh bủa ra, làm thanh tịnh lại dòng điện từ âm dương đang xoay rối loạn trong tam giới. Vì đang trong kỷ nguyên khoa học phát triển, con người dễ bớt mê tín hơn, khi được gặp Vị khai thị sẽ dễ ngộ đạo hơn. Khi đã ngộ đạo, được nhận lại tự tánh, nếu sống được với Tự Tánh được chừng nào thời gian cũng sẽ bủa ra điện từ quang chừng đó giúp cân bằng năng lượng bất ổn. Khi sống đúng thì cũng tự nhiên sống tốt, mà sống tốt thì cũng bủa ra năng lượng cực dương là một dạng năng lượng tốt cho thế giới– đó là ý nghĩa vì sao cả thế giới được an lành khi có một vị Phật xuất thế.
2.
Mừng ngày Phật Đản độ đời – Giúp bao nhân thế chơi vơi về nhà
Một lần nữa nhấn mạnh sự kiện Phật Đản là ngày trọng đại – vì là cơ hội để chúng sanh được đưa về “nhà như lai”. Bao người đang lạc lối giữa Ta Bà, chơi vơi giữa sinh tử – thì nay nhờ đại duyên gặp Phật mà có thể trở về.
Thoát ra huyễn cảnh Ta Bà – Thấy được chân lý muôn nhà lành thay
Khi được độ, người hữu duyên sẽ dần thoát khỏi những ảo tưởng trong cõi trần, nhận ra mọi thứ đều là huyễn hóa. Từ đó, thấy được chân lý tối hậu – không còn tranh hơn thua, chỉ sống thiện lành, sống “lành thay” không chỉ cho mình mà còn là bình an cho người khác. Người khác ra sao mình cũng vẫn an nhiên.
3.
Đại duyên Phật Đản cõi này – Trao truyền chánh pháp thoát lầy thế gian
Lời nhắc về giá trị phi thường của ngày Phật Đản: vị Phật không ở Phật giới mà xuống cõi Ta Bà trao truyền chánh pháp – giúp chúng sanh thoát ra khỏi sự lầy lội, chìm đắm trong khổ đau thế tục. Đây là sự kiện cần được trân trọng và ghi nhớ.
Ai mà nhận được sẽ an – luôn luôn tinh tấn an nhàn thảnh thơi
Ai nhận được chánh pháp, hành đúng theo thì tự nhiên sẽ được an. Tuy nhiên, để có được sự an nhàn thảnh thơi ấy thì điều kiện tiên quyết là phải tinh tấn – không thể buông xuôi, ỷ lại.
4.
Ai ơi đang sống ở đời – Nhận được Tự Tánh chính lời Phật trao
Một lời kêu gọi rõ ràng: người nào đang sống mà nhận được Tự Tánh – chính là đã tiếp nhận được lời trao truyền từ Phật.
Hành ngay sẽ thoát khổ đau – Thấy nghe nói biết việc nào cũng thông
Khi sống được với Tự Tánh và hành theo đó, thì tự nhiên thoát khổ đau. Tuy nhiên, nếu không thấy-nghe-nói-biết rõ ràng, thì chưa thể “thông”. Vì sao không rõ? Vì không ở yên nơi tánh mà thường chạy theo tưởng. Khi ở yên nơi tánh thì thấy rõ ràng, còn chạy theo vọng tưởng thì lập tức mất rõ ràng.
5.
Đời người sẽ mãi thong dong – Không còn sanh tử long bông sáu loài
Nếu hành đúng Tự Tánh, thì cuối đời bỏ thân xác mà không còn bị cuốn theo vòng luân hồi của sáu loài. Cuộc đời trở nên thong dong, không còn trôi lăn theo sanh tử.
Đời người sẽ hết mệt nhoài – Ung dung tự tại sống hoài an yên
Hết mệt nhoài là hết phiền não khổ đau, sống trong sự ung dung, tự tại, và sự an yên ấy không bị mất đi – đó là đời sống chân thật của người giác ngộ.
6.
Đại duyên Phật Đản đưa thuyền – Dẫn đàn con cháu hữu duyên về Nhà
Hình ảnh “đưa thuyền” là ẩn dụ cho phương tiện của Phật Đà đưa người hữu duyên về “nhà Như Lai”. Chỉ người nào hữu duyên mới lên thuyền được – đây là cơ hội cực kỳ quý giá.
Con xin cảm niệm Phật Đà – Nguyện hành Chánh Pháp Thích Ca lưu truyền
“Cảm” là cảm nhận sâu sắc ân Phật; “niệm” là ghi nhớ không quên. Người học đạo phải phát nguyện hành trì rốt ráo con đường Thích Ca để lại – để tiếp nối chánh pháp.
7.
Giúp người đại phúc đại duyên – Ai bị khổ não ưu phiền đều tan
Lặp lại một lần nữa tầm quan trọng của “đại phúc đại duyên” – không có hai yếu tố này thì không thể thành Phật. Chính nhờ vị Phật hiện thế mà người bị khổ đau ưu phiền sẽ được hóa giải.
Giúp cho nhân thế an nhàn – Người duyên sẽ được hằng an muôn thời
Sự hiện thế của vị Phật mang lại sự an nhàn cho nhân thế, và người có duyên thì sẽ luôn an – không chỉ tạm thời mà là an lâu dài, bền vững.
8.
Thế nhân đại Phúc Phật ơi – Hai lăm thế kỷ nhận lời Phật trao
Câu cảm thán đầy biết ơn: “Phật ơi, thế nhân đã nhận được lời Ngài trao từ hơn 2500 năm nay”.
Thuở ấy, đạo sĩ A tư đà – một bậc chân tu đắc đạo, thường ẩn cư trên núi Tuyết và được chư Thiên mách bảo – đã xuống núi đến thành Kapilavatthu để xem tướng Thái tử mới sinh. Khi gặp Thái tử, ông kinh ngạc trước oai đức và quý tướng siêu phàm nơi Ngài, liền khẳng định đứa bé này sau này sẽ thành Phật, đi độ hóa chúng sanh. A tư đà mừng cho thế gian vì sắp có bậc Đại Giác ra đời, nhưng đồng thời cũng bật khóc vì đau buồn và thương tiếc cho chính bản thân, đã sống 3000 năm, thần thông quảng đại vậy mà không đợi được đến ngày Đức Phật thành Đạo để nghe ngài giảng pháp. Vậy nên mới thấy sự kiện Phật xuất thế được quý trọng tới cỡ nào. nếu không đủ đại duyên đại phúc, dù có thần thông quảng đại cỡ nào, vẫn là phàm phu nếu không gặp được Phật.
Biết rõ Tự Tánh ra sao – Thường hành nơi ấy thế nào cũng ra
Chỉ khi được khai thị bởi vị Đạo nhân vô tu vô chứng thì mới thật sự biết rõ Tự Tánh là gì – không còn ở trên chữ nghĩa. Khi biết rồi, thì phải thường hành – nếu hành đúng nơi ấy thì tự nhiên sẽ “ra”, sẽ thoát.
9.
Ai duyên thoát khỏi Ta Bà – Hành ngay Tự Tánh Phật Đà dẫn đưa
Lời nhắc rõ ràng: ai có duyên thì sẽ thoát được khỏi cõi Ta Bà. Nhưng không phải chỉ biết là đủ – mà phải hành ngay Tự Tánh, thì mới được Phật Đà dẫn về.
Người ơi tinh tấn sớm trưa – Thường hành Tự Tánh Nhà Xưa sẽ về
Lời nhắn nhủ đầy tha thiết: tinh tấn hành trì Tự Tánh – từ sáng đến tối, từ lúc mở mắt đến lúc ngủ – thì sẽ có ngày về được Nhà Xưa.
10.
Từ nay hết vọng hết mê – An nhiên tự tại về Quê xưa mình
Một khi đã nhận ra Tự Tánh, hành trì đúng, thì hết vọng tưởng, hết mê lầm – sống trong sự an nhiên, tự tại, trở về quê xưa vốn có.
Là nơi bất tử bất sinh – Thường lạc ngã tịnh ngay mình hằng an
Đó chính là nơi không sanh không diệt – nơi 4 đức niết bàn “thường, lạc, ngã, tịnh” – mà thật ra không ở đâu xa, mà “ngay mình hằng an”. Ngay nơi mình mà thường trụ – chỉ cần sống đúng Tự Tánh thì không cần tìm kiếm đâu khác.', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_z46yk_1', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Mừng ngày Phật Đản độ đời
Giúp bao nhân thế chơi vơi về Nhà
Thoát ra huyễn cảnh Ta Bà
Thấy được chân lý muôn nhà Lành thay', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_05kkn_6', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Giúp người đại phúc đại duyên
Ai bị khổ não ưu phiền đều tan
Giúp cho nhân thế an nhàn
Người duyên sẽ được hằng an muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_kpyy7_7', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Thế nhân đại Phúc Phật ơi
Hai lăm thế kỷ nhận lời Phật trao
Biết rõ Tự Tánh ra sao
Thường hành nơi ấy thế nào cũng ra', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_iv9ia_8', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Ai duyên thoát khỏi Ta Bà
Hành ngay Tự Tánh Phật Đà dẫn đưa
Người ơi tinh tấn sớm trưa
Thường hành Tự Tánh Nhà Xưa sẽ về', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_u8138_9', '88a4d418-bc3b-40ee-8fe3-02af19e8052e', 'Từ nay hết vọng hết mê
An nhiên tự tại về Quê Xưa mình
Là nơi bất tử bất sinh
Thường Lạc Ngã Tịnh ngay mình hằng an', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.871Z', '2026-06-16T03:08:15.871Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_76eoc_0', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Tháng Bảy là tháng thế nào
Sao người lo lắng ra vào bất an
Làm gì cũng thấy gian nan
Chỉ vì chấp niệm mất đàng an nhiên', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_rl516_1', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Tháng Bảy là tháng thánh hiền
Nhắc người báo Hiếu hiện tiền mẹ cha
Sống sao vẹn hiếu Ta Bà
Giúp Cha giúp Mẹ thoát ra khổ sầu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_wzkab_2', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Tháng Bảy không khẩn không cầu
Người luôn sống đúng Ma nào đến thăm
Tìm chi các chốn lang băm
An đâu chẳng thấy sinh hầm hực thêm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_rq7vg_3', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Tháng Bảy là tháng thứ tha
Gieo bao sai trái nhận ra lỗi mình
Quyết tâm sám hối thật tình
Nguyện không lặp lại lỗi mình còn chi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_3xq07_4', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Tháng Bảy là tháng từ bi
Kẻ thù gieo oán gánh chi hỡi người
Buông tha người sẽ tươi cười
Chẳng còn ân oán điểm mười đại bi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_5suo0_5', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Người ơi buông chấp niệm đi
Cô hồn chỉ phá kẻ lì vô minh
Hành ngay Tự Tánh nơi mình
Chẳng va chẳng dính chẳng sinh muộn phiền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_zwv1s_6', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Đời người sẽ hết đảo điên
Từ nay người sống an nhiên muôn thời
Tùy duyên giúp đỡ người đời
Thoát ra chấp niệm mê lầm tháng năm', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_51azr_7', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Nay người thoát cảnh tối tăm
Giúp Cha giúp Mẹ thoát lầm thế gian
Cha Mẹ về chốn An Nhàn
Thoát ly sanh tử là đàng Hiếu Nhân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_h4h0z_8', '0bdf2935-9449-41d4-a73d-871941a4c433', 'Nay Vô chỉ rõ mười phân
Ngày nào cũng tốt chẳng cần đắn đo
Luôn hành Tự Tánh không lo
Ung dung tự tại lên đò về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.883Z', '2026-06-16T03:08:15.883Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_oimko_0', '98d4f524-1d8c-415a-8972-782deab33afd', 'Lành thay con trẻ kính lòng
Vu Lan Đại Lễ Kệ Thông con trình
Tỏ lòng hiếu kinh ân sinh
Ân dìu ân dắt ân tình bảo ban', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_692gi_1', '98d4f524-1d8c-415a-8972-782deab33afd', 'Dù cho đôi lúc lang thang
Sanh Tâm nghi hoặc lạc đàng chân như
Thành Tâm sám hối Phật Chư
Quyết lòng buông bỏ sống như Phật truyền', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_cbmpn_2', '98d4f524-1d8c-415a-8972-782deab33afd', 'Vu Lan Đại Lễ đại duyên
Nguyện cho con cháu rõ thuyền Như Lai
Hành nơi tự tánh không sai
Vô hình vô vật biết ai là mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_0v7nj_3', '98d4f524-1d8c-415a-8972-782deab33afd', 'Nguyện cho con cháu tỏ minh
Thấy nghe nói biết vọng sinh không còn
Hành không dính mắc viên tròn
An nhiên dạo cảnh lối mòn về Quê', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_vd1aw_4', '98d4f524-1d8c-415a-8972-782deab33afd', 'Con ơi nhớ tỉnh đừng mê
Tròn Ân tròn Hiếu đừng chê Lão Đò
Theo Lão con thoát cảnh mò
Đến nơi lạc quốc nhờ Đò Lão đưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_p3gqe_5', '98d4f524-1d8c-415a-8972-782deab33afd', 'Nguyện con cháu được rõ thừa
Lên Đò Không Đáy quê xưa rõ liền
Nguyện con cháu hết ưu phiền
An nhiên lướt sóng về miền Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.899Z', '2026-06-16T03:08:15.899Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_d613l_0', '78f81b09-c569-4508-8d8c-ff2191e12317', 'Vu Lan Đại Lễ Hiếu Ân
Các con sám hối thành tâm lỗi mình
Thế gian hai hạng thoát sình
Một chân sám hối một hành không sai', 'Tôn Tử  Và Chúng Sanh', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.911Z', '2026-06-16T03:08:15.911Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_a1hep_1', '78f81b09-c569-4508-8d8c-ff2191e12317', 'Lành thay con rõ Như Lai
Tùy duyên hóa cảnh diễn hoài tướng Ma
Tỏ minh con chẳng vọng va
Vô vật bản thể mới là Phật Xưa', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.911Z', '2026-06-16T03:08:15.911Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_lk6c4_2', '78f81b09-c569-4508-8d8c-ff2191e12317', 'Nguyện con thoát cảnh nắng mưa
Nay con đã rõ đường xưa hãy về
Nguyện con thoát khỏi bờ mê
An nhiên con bước về miền Như Lai.', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.911Z', '2026-06-16T03:08:15.911Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_olikc_0', '19099ab5-633f-4ac9-b90e-05733d39fe5a', 'Lành thay con cháu tỏ lòng
Nhớ ngày Giáo Lễ Đất Rồng năm nay
kính lòng con cháu tỏ bày
Lời kệ dâng kính rõ ngay lòng thành', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.917Z', '2026-06-16T03:08:15.917Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_ndmzy_1', '19099ab5-633f-4ac9-b90e-05733d39fe5a', 'Các con đã được khai sanh
Con đường giải thoát nhớ hành cho Viên
Sống trong tam giới đảo điên
Đạo đời con nhớ đi liền với nhau', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.917Z', '2026-06-16T03:08:15.917Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_bqv0k_2', '19099ab5-633f-4ac9-b90e-05733d39fe5a', 'Nguyện cho con cháu thoát sầu
Sống không dính mắc khổ đau không còn
Nguyện cho con cháu Viên Tròn
Đồng thành Phật Đạo cháu con sum vầy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.917Z', '2026-06-16T03:08:15.917Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_89ink_0', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Thanh Như con xin kính trình Kệ cúng dường Sư Cha Tam Vô
Vu Lan Tháng Bảy năm nay
Được Cha khai thị hiện bày hiếu nhân
Rõ Mình sống đúng Pháp Thân', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_7ulep_1', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Buông đi chấp niệm muôn phần an yên
Không gieo sai trái muộn phiền
Không tham không luyến thoát liền tử sanh
Cần chi cúng lạy loanh quanh', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_vhqcz_2', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Cần chi giải hạn đua tranh chốn đời
Ân Cha không nói bằng lời
Cho con được sống muôn thời thong dong
Ngày đêm Cha chẳng tiếc công', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_k0j56_3', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Thức cùng con trẻ rạng thông si lầm
Vậy mà một phút lạc tâm
Con buông tiếng gọi thậm thâm ngày nào
Khi cần “Cha hỡi" ngọt ngào', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_5gilm_4', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Về rồi sinh oán tuôn trào trách Cha
Chạy theo cái Ngã vọng va
Đâu còn nhớ đến lúc ta khổ sầu
Ai thời không quản đêm thâu', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_b4wig_5', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Giúp con thoát cảnh lo âu huyễn trần
Cho con thấy rõ Pháp Thân
Cảnh dù có đến chẳng cần vướng chi
Chỉ vì con trẻ ngu lì', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_rkdfm_6', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Chứ Cha đâu lấy thứ gì của con
Thấy tâm con trẻ còn non
Cha luôn dìu dắt viên tròn từng li
Thế mà con vẫn sinh nghi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_7xg6e_7', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Buông lời cay nghiệt thoát ly Nhà mình
Cha ơi, con nguyện thoát sình
Cùng Huynh cùng Đệ vô minh xa rời
Hành theo tự tánh muôn thời', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162361_hris7_8', '9d23390e-c0dd-4b7a-b97c-4e6ea3aa4567', 'Vu Lan báo hiếu về nơi Quê Nhà
Quê Nhà ở đó có Cha
An nhiên tự tại thoát ra luân hồi
Thanh Như', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.923Z', '2026-06-16T03:08:15.923Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_znvfj_0', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Dạ Nhân Mùa Vu Lan Kính Hiếu Ý Như Con Kính Trình Kệ
Cúng Dường Cảm Niệm Ân Sư Cha Tam Vô
Niệm Ân Người vì chúng con thị hiện
Sanh ra con trong Chánh Pháp Như Lai', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_muvns_1', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Ngày qua ngày chẳng màng đến thời gian
Người nâng niu từng đứa con đỏ hỏn
Khi chập chững đến lúc trưởng thành hơn
Không quản ngại ngày đêm mưa hay nắng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_mwh7r_2', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Ánh mắt Người luôn ấm áp yêu thương
Con hư ngoan Người đều thương như một
Không bao giờ phân biệt chỗ nhị nguyên
Con phạm lỗi con quỳ xin sám hối', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_5bfbn_3', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Suốt thâu đêm Người chẳng ngủ vì con
Người ân cần thương cho đàn con dại
Mãi mê mờ không ngại chốn trần lao
Con chưa tròn Người đánh đòn Đại Bi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_x4sw8_4', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Người uyển chuyển trong từng lời dạy dỗ
Chỉ các con đến chỗ Bất Tư Nghì
Người lại rưới nước Cam Lồ dịu mát
Rửa bụi trần cho đàn con Tỉnh Thức', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_wvim3_5', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Người luôn nhắc các con luôn rõ biết
Không lang thang không dính mắc bụi trần
Luôn Tỉnh Thức không rơi vào vòng xoáy
Điện âm dương tứ đại cứ xoay vần', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_jpyun_6', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Luôn rõ mình ở Pháp Thân thanh tịnh
Sống an yên không dính mắc ưu phiền
Phải rõ mình hiểu biết mới yêu thương
Nơi tự tánh phải hành cho đúng đắn', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_qblqa_7', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Dùng được tánh thì không vọng không tưởng
Sống an nhiên thì đâu phải luân hồi
Ngày qua ngày từng lời Người khai thị
Ân của Người con nói sao hết được', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_oqom1_8', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Lời nói được là lời không chân thật
Ở Pháp Thân sẽ thấu rõ Ân Người
Lòng con trẻ gửi trọn vào hư không
Và luôn mãi hành theo lời Người dạy', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_gzrtk_9', 'a6ca70ec-6990-4ae2-a6c2-192c92ca98c8', 'Luôn tinh tấn bước đi không ngần ngại
Chốn Quê Xưa nơi ấy Cha đang chờ.
Ý Như  01/07/2023 ( Âm Lịch)', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.929Z', '2026-06-16T03:08:15.929Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_m6f6x_0', 'b26a09cd-bb94-45a6-925b-cad5076855f7', 'Cả năm trong cõi ta bà
Có vui có khổ có va hầm cầu
Có tham có luyến có sầu
Cuối năm con nhớ nơi đâu là Nhà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.934Z', '2026-06-16T03:08:15.934Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_6ngwh_1', 'b26a09cd-bb94-45a6-925b-cad5076855f7', 'Gửi cho con cháu đang cà
Tân niên tinh tấn thoát ma thình lình
Muôn thời luôn biết rõ mình
Dù cho vạn cảnh diệt sinh không màng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.934Z', '2026-06-16T03:08:15.934Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_nnz3m_2', 'b26a09cd-bb94-45a6-925b-cad5076855f7', 'Đại duyên con đã rõ đàng
Nhớ hành ở chỗ luôn an muôn thời
Nguyện cho con cháu ở đời
Công hạnh viên mãn về nơi Phật Đà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.934Z', '2026-06-16T03:08:15.934Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_ggkjd_0', 'ffd77c68-d557-431d-8952-9543430f5e3a', 'Toàn Niên Tất Bật Trần Gian Giả
Chung Niên Buông Xã Đáo Cổ Gia
Tỏ Ta An Lạc Như Lai Chốn
Hằng Niên Tự Tại Dạo Ta Bà', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.942Z', '2026-06-16T03:08:15.942Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_bkelj_0', '2b0ad50b-bc8c-49d3-9a6a-a0fd6a7764c3', 'Duyên xuân tết đến năm nay
Cháu con quy tụ sum vầy bên nhau
Pháo hoa nổ khắp muôn màu
Cùng nhau đối kệ đêm thâu vui mừng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.948Z', '2026-06-16T03:08:15.948Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_24l5m_1', '2b0ad50b-bc8c-49d3-9a6a-a0fd6a7764c3', 'Lành thay con cháu biết Dừng
Tết Xuân buôn hết từng bừng về Cha
Lành thay con mãi rõ Nhà
Tết Xuân trình kệ dâng Cha kính lòng', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.948Z', '2026-06-16T03:08:15.948Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_449dw_2', '2b0ad50b-bc8c-49d3-9a6a-a0fd6a7764c3', 'Duyên xuân Cha tặng chữ Không
Không buồn không khổ không than không sầu
Nhắc con từ bỏ chữ Thâu
Tùy duyên đối cảnh chẳng Thâu vào mình', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.948Z', '2026-06-16T03:08:15.948Z');
INSERT INTO "Stanza" ("id", "poemId", "content", "meaning", "audioUrl", "tags", "createdAt", "updatedAt") VALUES ('poem_1776835162362_h6qti_3', '2b0ad50b-bc8c-49d3-9a6a-a0fd6a7764c3', 'Nguyện cho con cháu tỏ minh
Rõ mình chính Phật ngay mình hằng an
Nguyện cho con cháu mãi nhàn
Thong dong con ở niết bàn muôn nơi', '', NULL, ARRAY[$$kệ pháp$$]::text[], '2026-06-16T03:08:15.948Z', '2026-06-16T03:08:15.948Z');

-- NẠP DỮ LIỆU BẢNG VoiceStyle
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (1, 'Trẻ em - Hồn nhiên, thắc mắc', 'giọng trẻ em, tông giọng cao, hồn nhiên, ngơ ngác, thắc mắc, miền Nam, đúng chính tả', '2026-06-16T03:08:14.711Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (2, 'Trẻ em - Sợ hãi, mếu máo', 'giọng trẻ em, tông giọng run rẩy, sợ hãi, mếu máo, thiết tha, miền Nam, đúng chính tả', '2026-06-16T03:08:14.714Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (3, 'Trẻ em - Vui vẻ, lanh lợi', 'giọng trẻ em, lanh lợi, vui tươi, tốc độ nói hơi nhanh, miền Nam, đúng chính tả', '2026-06-16T03:08:14.717Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (4, 'Trẻ em - Lễ phép, ngoan ngoãn', 'giọng trẻ em, tông giọng trầm ấm hơn, từ tốn, lễ phép, ngoan ngoãn, miền Nam, đúng chính tả', '2026-06-16T03:08:14.720Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (5, 'Trẻ em - Bướng bỉnh, cãi lý', 'giọng trẻ em, cao giọng, bướng bỉnh, hơi nhõng nhẽo, cãi lý, miền Nam, đúng chính tả', '2026-06-16T03:08:14.722Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (6, 'Thanh niên - Rối rắm, bế tắc', 'giọng thanh niên, tốc độ nói vừa phải, tỏ vẻ rối rắm, bế tắc, mệt mỏi, miền Nam, đúng chính tả', '2026-06-16T03:08:14.724Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (7, 'Thanh niên - Thiết tha, khẩn cầu', 'giọng thanh niên, tha thiết, khẩn cầu, khao khát tìm chân lý, miền Nam, đúng chính tả', '2026-06-16T03:08:14.727Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (8, 'Thanh niên - Tức giận, bất mãn', 'giọng thanh niên, tông giọng hơi gắt, tức giận, bất mãn, trách móc cuộc đời, miền Nam, đúng chính tả', '2026-06-16T03:08:14.729Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (9, 'Thanh niên - Tự tin, kiêu ngạo', 'giọng thanh niên, dõng dạc, tự tin, kiêu ngạo, lý trí, rành mạch, miền Nam, đúng chính tả', '2026-06-16T03:08:14.731Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (10, 'Thanh niên - Hạnh phúc, vỡ òa', 'giọng thanh niên, vỡ òa cảm xúc, nghẹn ngào vì hạnh phúc, ngộ đạo, miền Nam, đúng chính tả', '2026-06-16T03:08:14.733Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (11, 'Thanh niên - Lạnh lùng, dò xét', 'giọng thanh niên, tông giọng lạnh lùng, dò xét, nghi ngờ, chậm rãi, miền Nam, đúng chính tả', '2026-06-16T03:08:14.736Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (12, 'Trung niên - Trải đời, chua xót', 'giọng trung niên, trầm buồn, trải đời, chua xót, ngậm ngùi, miền Nam, đúng chính tả', '2026-06-16T03:08:14.739Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (13, 'Trung niên - Điềm đạm, suy tư', 'giọng trung niên, điềm đạm, chậm rãi, suy tư, thắc mắc sâu sắc, miền Nam, đúng chính tả', '2026-06-16T03:08:14.744Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (14, 'Trung niên - Nặng gánh gia đình', 'giọng trung niên, mệt mỏi, thở dài, nặng gánh gia đình, bế tắc, miền Nam, đúng chính tả', '2026-06-16T03:08:14.753Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (15, 'Trung niên - Hối hận, ăn năn', 'giọng trung niên, run rẩy nhẹ, hối hận, ăn năn, tha thiết xin lời khuyên, miền Nam, đúng chính tả', '2026-06-16T03:08:14.759Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (16, 'Trung niên - Bình thản, buông xả', 'giọng trung niên, bình thản, nhẹ nhàng, có ý buông xả, thanh thản, miền Nam, đúng chính tả', '2026-06-16T03:08:14.762Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (17, 'Người già - Lão thành, thông thái', 'giọng người già, khàn nhẹ, chậm rãi, lão thành, thông thái, miền Nam, đúng chính tả', '2026-06-16T03:08:14.766Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (18, 'Người già - Yếu ớt, lo âu', 'giọng người già, thều thào, yếu ớt, lo âu về cái chết, sợ hãi, miền Nam, đúng chính tả', '2026-06-16T03:08:14.770Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (19, 'Người già - Từ bi, ấm áp', 'giọng người già, trầm ấm, từ bi, hiền hậu, thong thả, miền Nam, đúng chính tả', '2026-06-16T03:08:14.775Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (20, 'Người già - Cay đắng, nuối tiếc', 'giọng người già, ngậm ngùi, cay đắng, nuối tiếc quá khứ, chậm rãi, miền Nam, đúng chính tả', '2026-06-16T03:08:14.780Z');
INSERT INTO "VoiceStyle" ("id", "label", "promptText", "createdAt") VALUES (21, 'Người già - Nhẹ nhàng, tỉnh mộng', 'giọng người già, thanh tịnh, nhẹ nhàng, thấu hiểu mộng ảo, mỉm cười, miền Nam, đúng chính tả', '2026-06-16T03:08:14.783Z');

-- NẠP DỮ LIỆU BẢNG BackgroundMusic
INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES ('bgm_1', '🎵 Tiếng Suối Chảy Mẫu', 'https://res.cloudinary.com/dmpy1yv4c/video/upload/v1774351901/Suo%CC%82%CC%81i_cha%CC%89y_jde1hz.mp4', true, '2026-06-16T03:08:14.692Z');
INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES ('bgm_dha', '🎵 Đường Hằng An (Tone Nam)', 'https://res.cloudinary.com/dmpy1yv4c/video/upload/v1774378238/%C4%90u%CC%9Bo%CC%9B%CC%80ng_Ha%CC%86%CC%80ng_An_Tone_Nam._Ba%CC%89n_Pho%CC%82%CC%81i_mhavlv.wav', true, '2026-06-16T03:08:14.701Z');
INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES ('bgm_2', '🎵 Nhạc Thiền Tĩnh Tâm 1', 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3', true, '2026-06-16T03:08:14.704Z');
INSERT INTO "BackgroundMusic" ("id", "name", "url", "isActive", "createdAt") VALUES ('bgm_3', '🎵 Nhạc Thiền Không Lời 2', 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3', true, '2026-06-16T03:08:14.707Z');

-- NẠP DỮ LIỆU BẢNG ChatSession
INSERT INTO "ChatSession" ("id", "userId", "title", "createdAt", "updatedAt") VALUES ('89b5e05b-6883-4560-a335-63137bc889d5', NULL, 'Cuộc đàm đạo 1', '2026-06-16T03:21:57.785Z', '2026-06-16T03:21:57.785Z');

-- NẠP DỮ LIỆU BẢNG ChatMessage

-- NẠP DỮ LIỆU BẢNG UserFavorite

-- NẠP DỮ LIỆU BẢNG PromptTemplate
INSERT INTO "PromptTemplate" ("id", "name", "content", "createdAt", "updatedAt") VALUES ('8a55e3e6-f846-4eaa-84c8-1f980d1b68ab', 'LaoDefault', 'Con hãy đóng vai Ông Lão, một người thầy giác ngộ điềm đạm, từ bi, thông suốt Phật pháp Tam Vô. Hãy trả lời câu hỏi của người dùng bằng giọng văn mộc mạc, sâu sắc, hướng dẫn họ nhận ra bản tánh thanh tịnh.', '2026-06-16T03:08:15.953Z', '2026-06-16T03:08:15.953Z');

-- Kích hoạt lại kiểm tra khóa ngoại sau khi hoàn tất nạp dữ liệu
SET session_replication_role = 'origin';
