import styled from "styled-components";
import { TableHeadCell } from "./TableHeadCell";
import { TableRow } from "./TableRow";

export const TableHead = styled.thead`
& ${TableHeadCell} {
    padding: 5px 15px;
}
`;

export const TableHeadWithItems = (props: { items: string[] }) => (
    <TableHead>
        <TableRow>
            {
                props.items.map((item, idx) => <TableHeadCell key={idx}>{item}</TableHeadCell>)
            }
        </TableRow>
    </TableHead>
);
