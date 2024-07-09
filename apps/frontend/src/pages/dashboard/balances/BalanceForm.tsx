import { Navigate, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import RequireAuth from "../../../features/auth/RequireAuth";
import { UserRoles } from "../../../features/auth/user-role.enum";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../../../components/Button";
import CurrencyFlag from "react-currency-flags";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { loadCurrenciesList, selectCurrencies } from "../../../features/balances/BalancesListSlice";
import { loadActiveAccount, loadTransaction, selectAccounts, setActiveAccount, setCurrencyAccount } from "../../../features/accounts/AccountsListSlice";
export default function BalanceForm() {
    const navigate = useNavigate();
    const currencies = useAppSelector(selectCurrencies);
    const [currencyValue, setCurrencyValue] = useState('');
    const currenciesToDisplay = [...currencies].filter(row=>{
        return !currencyValue.length || row.code.toLowerCase().indexOf(currencyValue) > -1 || row.name.toLowerCase().indexOf(currencyValue) > -1;
    });
    const dispatch =useAppDispatch();
    useEffect(
        () => {
            dispatch(loadCurrenciesList());
        },
        []
    );
    return(
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
            <Container>
                <TopTitleContainer>
                    <TopTitle><strong>Add an account</strong></TopTitle>
                    <Search>
                        <input type="text" name="search" style={{width: '100%', padding:'10px', borderRadius: '10px'}}  placeholder="Find a currency..." onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                        // console.log('val', e.target.value);
                        setCurrencyValue(e.target.value.toLowerCase());
                    }} />
                    </Search>
                </TopTitleContainer>
                <p>Get accounts in more than 30 currencies. Local account details are available in EUR, GBP and USD.</p>
                <ListGroup>
                    { currenciesToDisplay.filter(d => d.online_trading).map((data) => (
                            <ListGroupItem key={data.code}>
                                <Link to='' 
                                    onClick={()=>{
                                        const addAccounts = async () => {
                                            try {
                                                const balance = await dispatch(setCurrencyAccount({currency: data.code})).unwrap();
                                                navigate("/dashboard"+ "/balances/" +  data.code + '/transactions/' + balance.account_id)
                                                await dispatch(loadTransaction({account_id:balance.account_id, currency: data.code,settles_at_from: '2000-01-01',completed_at_from:'2000-01-01', page: 1}));
                                                //await dispatch(loadActiveAccount());
                                                
                                            } catch (error) {
                                                console.log(error);
                                                
                                            }
                                        }
                                        addAccounts();
                                        return false;
                                    }}
                                style={{display: 'flex', justifyContent:"space-between", width: '100%'}}>
                                    <ListGroupImageAndTextItem>
                                        <CurrencyFlag
                                            style={{ borderRadius: "50%" }}
                                            currency={data.code}
                                            width={30}
                                            height={30}
                                        />
                                        <ListTextGroup>
                                            <ListTextGroupItem>{data.name} ({data.code})</ListTextGroupItem>
                                        </ListTextGroup> 
                                    </ListGroupImageAndTextItem>
                                    <img src={`${process.env.PUBLIC_URL}/images/nav/left-arrow.svg`} width="30" alt="Euro" />
                                </Link>
                            </ListGroupItem>
                            
                            
                        ))}
               </ListGroup>
               <NextButton>
                    <Button sky style = {{width: '50vh', margin:'50px 0px', borderRadius: '10px'}} onClick={() => navigate('/dashboard/balances')}>Back to Balances</Button>
                </NextButton>
            </Container>
            
            </DashboardLayout>
        </RequireAuth >
    )
};
const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
`

const TopTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @media(max-width: 768px) {
        display: block;
    }
`
const TopTitle = styled.h2`
    padding: 5px;
`
const Search =styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px auto;
    width: 30vw;
    @media(max-width: 768px) {
        display: block;
        width: 100%;
    }
`
const ListGroup =styled.ul`
    padding: 0;
    /* border: 1px solid ${(props)=>props.theme.colors.bgrey}; */
    border-bottom: none;
    `
const ListGroupItem = styled.li`
    display: flex;
    color:  ${(props) =>props.theme.colors.black};
    font-size:18px;
    margin:20px 0;
    padding: 5px 20px;
    justify-content: space-between;
    list-style-type: none;
    border-bottom: 1px solid ${(props)=>props.theme.colors.bgrey};
    /* padding-bottom: 20px; */
`
const ListTextGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
`
const ListTextGroupItem = styled.p`
    margin: 0;
`
const ListGroupImageAndTextItem = styled.div`
    display: flex;
    align-items: center;
    
`
const NextButton =styled.div`
    @media(max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media(max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;
