import styled from "styled-components";

const Wrapper = styled.a`
  height: 30px;
  line-height: 30px; /* 텍스트의 높이에 따라 상하 가운데 정렬 */
  margin: 0 10px;
  padding: 0px 10px;
  font-size: 17px;
  display: block;
  border: #a2a2a2 solid 1px;
  color: #565656;
  border-radius: 5px;
  text-align: center;
  background-color: white;

  &:hover {
    background-color: #ff8989; /* 색상 */
    color: white;
    border: #ff8989 solid 1px;
    cursor: pointer;
  }
`
const HeaderMenu = ({ name, link, onClick }) => {
    return (
        <Wrapper href={link} onClick={onClick} name={link}>
            {name}
        </Wrapper>
    );
};

export default HeaderMenu;