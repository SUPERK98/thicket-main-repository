import styled, {css} from "styled-components";
import Calendar from "react-calendar";

export const Wrapper = styled.div`
  display: flex; // Flex 컨테이너로 설정하여 자식 요소들을 플렉스 방향으로 배치
  width: 100%; // 부모 요소에 대해 100%의 너비를 차지
  justify-content: center;
`

export const InvisibleScroll = styled.main`
  margin-top: 119px; // 로거해더 이미지 크기에 따라 마진탑값 수동조절
  width: 1280px;
  height: auto;
  position: fixed; // 위치 고정
  display: flex;
  justify-content:center;
  align-items : center;
  ::-webkit-scrollbar {
    display: none;
  }
  //border: black solid 1px; // 테두리, 사이즈 확인용
`;
export const MainContainer = styled.div`
  width: 100%;
  overflow-y: scroll; // 내부 수직 스크롤바
  max-height: 88vh; // 계산 끝 - 90.5vh
  //border: black solid 1px; // 테두리, 사이즈 확인용
`;

export const DivList1 = styled.div`
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 73px;
`;

export const Poster1 = styled.div`
  padding: 0 9px 9px 9px;
  display: inline-block;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

export const Img1 = styled.img`
  min-width: 358px;
  max-width: 358px;
  height: 479px;
  border: 1px solid lightgray;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
`;

export const ImgInfo1 = styled.div`
  width: 358px;
  height: 99px;
  padding: 0 20px ;
  border: 1px solid lightgray;
  border-top: 0;
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  //gap: 10px; // 균등분배
`;

export const DivList2 = styled.div`
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 20px;
`;

export const Poster2 = styled.div`
  padding: 0 15px 15px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 630px;
  height: 275px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

export const Img2 = styled.img`
  max-width: 210px;
  min-width: 210px;
  height: 100%;
  border: 1px solid lightgray;
  border-right: 0;
  border-radius: 20px 0 0 20px;
`;

export const ImgDivInfo2 = styled.div`
  width: 400px;
  height: 100%;
  padding: 0 20px;
  border: 1px solid lightgray;
  border-left: 0;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px; // 사이 간격
`;

export const H1 = styled.h1`
    margin: 20px 0 20px 0;
    font-size: 32px;
`;

export const H2 = styled.h1`
    font-size: 24px;
`;

export const H3 = styled.h1`
    font-size: 18px;
`;

export const H4 = styled.h1`
    font-size: 16px;
`;

export const MarginTop = styled.main`
  margin-top: 119px; // 로거해더 이미지 크기에 따라 마진탑값 수동조절 // 바꿀꺼면 51.5로
  width: 1280px;
  position: fixed; // 위치 고정
`;

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  
`;

export const ASide = styled.div`
  align-items: center; // 자식 요소를 수직으로 중앙 정렬
  width: 160px;
  padding: 10px; // 모든 측면에 10px의 안쪽 여백 적용
  border: gray solid 1px; // 1px 두께의 검은색 실선 테두리
  border-radius: 5px; // 5px의 테두리를 둥글게 처리
  margin-top:20px;
`;

export const Main = styled.div`
  width: 1056px;
  padding: 10px; // 모든 측면에 10px의 안쪽 여백 적용
  margin-left: 20px; 
  border: black solid 1px; // 1px 두께의 검은색 실선 테두리
  border-radius: 5px; // 5px의 테두리를 둥글게 처리
  margin-top:20px;
`;

export const PaddingDiv = styled.div`
  padding: 5px 0;
`;

export const 왼쪽광고 = styled.div`
  width: 100px;
  height: 513px;
  margin: 126px 655px 0 0;
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const 오른쪽광고 = styled.div`
  width: 100px;
  height: 513px;
  margin: 126px 0 0 655px;
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ────────────────────── 아래 부분은 쇼 디테일 페이지  ──────────────────────

export const ShowMain = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const ShowSide = styled.div`
  margin-left: 20px;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Scroll = styled.div`
    overflow-y: scroll; // 내부 수직 스크롤바
    max-height: 83.8vh;  // 계산 끝 90.5vh-> 83.8
`;

export const SideTop = styled.div`
  align-items: center; // 자식 요소를 수직으로 중앙 정렬
  width: 330px;
  border: lightgray solid 1px; // 실선 테두리
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  margin:10px 0;
`;

export const DisabledSideBottom = styled.div`
  display: flex;
  width: 332px;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: #707070;
  cursor: pointer;
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.1em;
`;

export const SideBottom = styled.div`
  display: flex;
  width: 332px;
  height: 50px;
  margin-bottom: 20px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: #e73b34;
  cursor: pointer;
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.1em;
`;

export const StyledCalendar = styled(Calendar)`
  border: none;

  .react-calendar__navigation { // 년, 월
    margin-bottom: 0px
  }

  .react-calendar__navigation__label { // 년, 월
    font-size: 17px;
  }

  .react-calendar__navigation__arrow { // 년, 월 옆 네비게이션 버튼
    font-size: 22px;
  }

  .react-calendar__month-view__weekdays { // 요일 전체 div
    //background-color: #f0f0f0; /* 밝은 회색 배경 설정 필요할경우 색상 바꿔 */
  }
  abbr[title] {
    text-decoration: none;
    cursor: default;
    text-decoration-skip-ink: none;
  }
  .react-calendar__month-view__weekdays__weekday {
    font-size: 16px;
    cursor: default;
  }
  .react-calendar__month-view__days__day { // 일일(숫자)
    font-size: 16px;
  }
  
  .react-calendar__navigation__prev2-button,
  .react-calendar__navigation__next2-button { // 년 이동 버튼
    display: none;
  }

  .react-calendar__navigation__prev-button { // 이전월 이동 버튼
    color: #CCC;
    margin-left: 40px;
  }
  
  .react-calendar__navigation__next-button { // 다음월 이동 버튼
    color: #CCC;
    margin-right: 40px;
  }
  
  .react-calendar__month-view__days__day { // 전체 숫자 검정색
    color: black;
  }
  .react-calendar__tile:disabled { // 비활성화 배경
    background-color: #ffffff;
  } 
  .react-calendar__tile:disabled abbr {
    color: lightgray; /* 비활성화된 날짜의 텍스트 색상을 회색으로 설정 */
  }
  .react-calendar__navigation button:disabled { // 월 이동 배경
    background-color: #ffffff;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus { // 년월, 화살표 배경 흰색
    background-color: #ffffff;
  }
  .react-calendar__tile--active {
    background: #007fff;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #007fff;
  }
`;

export const PostImg = styled.img`
  width: 300px;
  height: 400px;
  margin-top: 20px;
`;

export const PostDetailImg = styled.img`
  display: block;
  width: auto; /* 이미지의 원본 크기로 표시하도록 설정 */
  max-width: 926px; /* 최대 너비를 926px로 제한 (원본보다 큰 경우에만 적용) */
  margin: 10px 0 20px 0;
`;

export const PostInfo = styled.div`
  width: 584px;
  height: 400px;
  margin-left: 40px;
  margin-top: 20px;
`;

export const LightGrayLine = styled.div`
  width: 100%;
  border-top: lightgray solid 1px;
`;

export const SideFont = styled.div`
  text-align: left;
  font-size: 14px;
  font-weight: bold;
`;
export const SideMarginTop = styled.div`
  width: 90%;
  margin-top: 10px;
`;
export const SideMargin = styled.div`
  width: 90%;
  margin: 7px 0;
`;

export const ButtonList = styled.div`
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

export const ChoiceDiv = styled.div`
  text-align: center;
  font-size: 14px;
  border: 1px solid ${props => (props.selected ? '#ff8989' : 'gray')};
  border-radius: 5px;
  padding: 10px;
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  background-color: ${props => (props.selected ? '#ff8989' : 'white')};
  font-weight: ${props => (props.selected ? 'bold' : 'normal')}; // Added font-weight property

  &:hover {
    background-color: ${props => (props.selected ? '#e87c7c' : props.onClick ? '#f0f0f0' : 'white')};
  }

  ${props => props.selected && props.selectedTime && css`
    background-color: #ff8989;
    font-weight: bold;
    color: white;
  `}
`;

export const Th  = styled.td`
  width: 80px;
  text-align: left;
  padding: 8px 0;
`;

export const Td  = styled.td`
  width: 80px;
  text-align: left;
  padding: 8px 0;
`;

export const Th1  = styled.td`
  width: 80px;
  text-align: left;
  padding: 8px 0;
  vertical-align: top;
`;


export const Td1  = styled.th`
  text-align: left;
`;

export const Th2  = styled.th`
  text-align: right;
  padding: 8px 0;
`;

export const Td2  = styled.th`
  text-align: right;
  padding-left: 20px;
`;