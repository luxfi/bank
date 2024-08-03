import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components';
import { Field, FieldAttributes, useField } from 'formik';

interface Props {
    isSearchable: boolean,
    options: Map<string, string>,
    isMulti: boolean,
    placeHolder: string,
    value: string,
    disabled: boolean,
    labeltext: string,
    name:string,
    callFunc: any
}
const Icon = () => {
    return (
      <svg height="20" width="20" viewBox="0 0 20 20">
        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
      </svg>
    );
  };
export default function SearchBox(props: Props){
    const [showMenu, setShowMenu] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedValue, setSelectedValue] = useState(props.isMulti ? props.value : null);
    const searchRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        setSelectedValue(props.value);
      }, [props.value]);
    useEffect(() => {
        setSearchValue("");
        if (showMenu && searchRef.current) {
          searchRef.current.focus();
        }
      }, [showMenu]);
    useEffect(() => {
        const handler = () => setShowMenu(false);
        window.addEventListener("click", handler);
        return () => {
          window.removeEventListener("click", handler);
        };
    },[]);
    const handleInputClick = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if(props.disabled){
            setShowMenu(false);
        }else{
            setShowMenu(!showMenu);
        }
        
    };
    const onSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };
    const isSelected = (currentValue: string) => {
        if (!selectedValue) {
          return false;
        }
        return selectedValue === currentValue;
    };
    const onItemClick = (key: string, value: string) => {
        setSelectedValue(value);
        props.callFunc(key);
    };
    const getDisplay = () => {
        if (!selectedValue) {
          return props.placeHolder;
        }
        return selectedValue;
    };
    const getOptions = () => {
        if (!searchValue) {
          return props.options;
        }
        return Array.from(props.options).filter(ele=>ele[0].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 || ele[1].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
      };
    const onKeyUp = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == 'Enter') {
            const options = Array.from(getOptions());
            if (options.length == 1) {
                setShowMenu(false);
                onItemClick(options[0][0], options[0][1])
            }
            e.preventDefault();
        }
    }
    
    return (
        <SearchContainer>
        <Label htmlFor={props.name}>{props.labeltext}</Label>
        <DropdownContainer onClick={handleInputClick}  id={props.name}>
            <DropdownInput>
                {getDisplay()}
                <Icon/>
            </DropdownInput>
            {
                showMenu&&
                <DropdownMenu className='dropdown-menu'>
                    {
                        props.isSearchable&&<SearchInput ref={searchRef} onChange={onSearch} value={searchValue} onKeyUp={onKeyUp} onKeyDown={onKeyUp}/>
                    }
                    {
                        getOptions()? Array.from(getOptions()).map(([key, value]) => (
                            <div 
                            key={key}
                            onClick={()=>onItemClick(key, value)}
                            className={`dropdown-item ${isSelected(key) && "selected"}`}
                            >{value}</div>
                        ))
                        :
                        null
                    }
                    <DropdownItem>
                </DropdownItem>
            </DropdownMenu>
            }
            
            </DropdownContainer>
        </SearchContainer>
    )
}
const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`
const DropdownContainer = styled.div`
    text-align: left;
    border: 1px solid #ccc;
    position: relative;
    border-radius: 5px;
    background-color: white;
`
const DropdownInput = styled.div`
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    
`
const DropdownMenu = styled.div`
    position: absolute;
    transform: translateY(4px);
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: auto;
    
`
const SearchInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
`
const DropdownItem = styled.div`
    padding: 5px;
    cursor: pointer;
`
const Label = styled.label`
    color: ${(props) => props.theme.colors.label};

    padding: 3px 10px;
    font-size: 0.8em;
    font-weight: bold;
`;
