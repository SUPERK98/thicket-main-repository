import styled from 'styled-components';
import DatePicker from "react-datepicker";
import React from "react";

export const Container = styled.div`
  padding: 10px;
  overflow-y: auto; // 내부 수직 스크롤바
  max-height: 76vh;
`;

export const CustomDiv = styled.div`
  padding: 20px 0 60px 0;
`;

export const PaddingTopDiv = styled.div`
  padding-top: 40px;
`;

export const FlexCenterDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const RelativeDiv = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const BetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TimeDiv = styled.div`
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
`;

export const WidthDiv = styled.div`
  width: 60px;
`;

export const RightDiv = styled.div`
  padding-top: 20px;
  text-align: right;
`;

export const CalenderDiv = styled.div`
  position: absolute;
  left: 280px;
  cursor: pointer;
`;

export const CalenderDiv2 = styled.div`
  position: absolute;
  left: 280px;
  top: 5px;
`;

export const H1 = styled.h1`
  margin: 0 0 20px 0;
  padding-left: 5px;
`;

export const CustomH1 = styled.h1`
  margin: 60px 0 20px 0;
  padding-left: 5px;
`;

export const H2 = styled.h2`
  margin: 0 0 20px 0;
  padding-left: 5px;
`;

export const P = styled.p`
  margin-left: 10px;
  font-size: 15px;
  color: #555;
  line-height: 1.7;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  height: 29px;
  padding: 10px;
  border-top: 1px solid #000;
  border-bottom: 1px solid #ccc;
  background: #f7f7f7;
  width: 180px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const Th2 = styled.th`
  text-align: left;
  height: 29px;
  padding: 10px;
  border-top: 1px solid #000;
  border-bottom: 1px solid #ccc;
  background: #f7f7f7;
  width: 180px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Td = styled.td`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background: white;
  border-top: 1px solid #000;
`;
export const Td2 = styled.td`
  //text-align: left;
  //padding: 10px;
  //border-bottom: 1px solid #ccc;
  //background: white;
  //border-top: 1px solid #000;
`;

export const Input = styled.input`
  width: 300px;
  height: 25px;
  box-sizing: border-box;
  padding: 5px
`;

export const InputFile = styled.input`
  display: none;
`;

export const Textarea = styled.textarea`
  width: 500px;
  height: 150px;
  box-sizing: border-box;
  padding: 3px 3px 3px 6px ;
`;

export const Button = styled.button`
  margin-left: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid #000;
  border-radius: 5px;
`;

export const Button1 = styled.button`
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid #000;
  border-radius: 5px;
`;

export const Button2 = styled.button`
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid #000;
  border-radius: 5px;
  margin-left: 10px;
`;

export const ButtonX = styled.button`
  padding: 0 3px;
  border: gray solid 1px;
`;

export const Select = styled.select`
  width: 300px;
  height: 25px;
  box-sizing: border-box;
`;

export const Img = styled.img`
  max-width: 100px;
  max-height: 100px;
  cursor: pointer;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 300px;
  height: 25px;
  box-sizing: border-box;
  cursor: pointer;
`;
export const StyledDatePicker2 = styled(DatePicker)`
  width: 300px;
  height: 25px;
  box-sizing: border-box;
`;

export const CalendarSVG = () => {
    return ( // 달력 아이콘
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
};

export const ImageViewerModal = ({ imageUrl, onClose }) => {
    return (// 이미지 설정
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onClick={onClose}
        >
            <img
                src={imageUrl}
                alt="Enlarged"
                style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
            />
        </div>
    );
};