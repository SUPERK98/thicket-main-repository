import {Container, H1, Table, TableHeaderRow, Td, TdNotCenterAnd} from '../../assets/css/setting/admin/StylesOfList';
import React, {useEffect, useState} from "react";

export const AdminOngoingList = ({contentHandler, showId}) => {
    const [showList, setShowList] = useState([]);
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers:{
                "Authorization": localStorage.getItem('token')
            }
        };

        fetch("/thicket-show/shows/ongoing/admin", requestOptions)
            .then(response => response.json())
            .then(result => {
                setShowList(result);
            });
    }, [])
    const handleTitleClick = () => {
        contentHandler("entrance");
    };
    return (
        <Container>
            <div>
                <H1>공 연 중</H1>
                <Table>
                    <tbody>
                    <TableHeaderRow />
                    {Array.isArray(showList) ? showList.map((value, index) => {
                        return (
                            <tr key={index}>
                                <Td>{index}</Td>
                                <Td>{value.stageType}</Td>
                                <TdNotCenterAnd onClick={handleTitleClick}>
                                    {value.name}
                                </TdNotCenterAnd>
                                <Td>{value.stageStatus}</Td>
                                <Td>{value.stageOpen}</Td>
                                <Td>{value.stageClose}</Td>
                            </tr>
                        )}):(<tr> <Td colSpan={6}>없음</Td> </tr>)}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};