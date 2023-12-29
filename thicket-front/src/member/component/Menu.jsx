import styled from "styled-components";

const Wrapper = styled.div`
  height: 40px;
  margin: 10px 10px 10px 10px;
  font-size: 20px;
  display: flex; /* Flex 컨테이너로 설정 */
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center; /* 수평 가운데 정렬 */
  border: lightgray solid 1px;
  border-radius: 5px;
  text-align: center;
  background-color: #ff8989;
  color: white;
  &:hover {
    background-color: lightgray;
    cursor: pointer;
  }
`;
const Menu = ({ name, link, onClick }) => {
    return (
        <Wrapper href={link} onClick={onClick} name={link}>
            {name}
        </Wrapper>
    );
};

export default Menu;