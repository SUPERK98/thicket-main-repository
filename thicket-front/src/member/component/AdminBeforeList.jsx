import React, {useEffect, useState} from "react";
import {
    Container,
    H1,
    P,
    Table,
    TableHeaderRow,
    Td,
    TdNotCenter,
    TdNotCenterAnd
} from '../../assets/css/setting/admin/StylesOfList';

export const AdminBeforeList = ({ contentHandler }) => {
    const [showList, setShowList] = useState([]);
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers:{
                "Authorization": localStorage.getItem('token')
            }
        };

        fetch("/thicket-show/shows/before/admin", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setShowList(result);
            });
    }, [])
    const handleTitleClick = () => {
        contentHandler("edit");
    };

    return (
        <Container>
            <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <H1>공연 예정</H1>
                    <P>
                        제목을 클릭하면 일부 내용을 수정할 수 있습니다.
                    </P>
                </div>
                <Table>
                    <tbody>
                    <TableHeaderRow />
                    {Array.isArray(showList) ? showList.map((value, index) => {
                        return (
                            <tr key={index}>
                                <Td>{index}</Td>
                                <Td>{value.stageType}</Td>
                                <TdNotCenterAnd>
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