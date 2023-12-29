import Menu from "../component/Menu";
import {MemberMyPage} from "../component/MemberMyPage";
import Withdraw from "../component/Withdraw";
import React, {useState} from "react";
import {MemberTicketingList} from "../component/MemberTicketingList";
import {MemberViewingList} from "../component/MemberViewingList";
import {MemberCouponList} from "../component/MemberCouponList";
import {ASide, Container, Main, MarginTop, Wrapper} from "../../assets/css/setting/MainStyleCSS";

const MyPage = () => {
    const [content, setContent] = useState("mypage");
    const contentHandler = (selectedContent) => {
        setContent(selectedContent);
    };

    const selectComponent = {
        mypage: <MemberMyPage contentHandler={contentHandler}/>,
        withdraw: <Withdraw />,
        ticketing: <MemberTicketingList />,
        viewing: <MemberViewingList />,
        coupon: <MemberCouponList />
    };

    return (
        <Wrapper>
            <MarginTop>
                <Container>
                    <ASide>
                        <Menu name={"회원 정보"} onClick={() => contentHandler("mypage")} />
                        <Menu name={"예매 내역"} onClick={() => contentHandler("ticketing")} />
                        <Menu name={"관람 내역"} onClick={() => contentHandler("viewing")} />
                        <Menu name={"보유 쿠폰"} onClick={() => contentHandler("coupon")} />
                    </ASide>
                    <Main>{selectComponent[content]}</Main>
                </Container>
            </MarginTop>
        </Wrapper>
    );
};

export default MyPage;