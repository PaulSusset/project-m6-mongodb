import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import FetchInitItems from '../../components/StateFunctions/FetchInitItems';
import { parseInitialItems, displayLoadState } from '../../reducers';
import SearchBar from '../../components/SearchBar';

import ItemCard from '../../components/ItemCard';

function Homepage() {
  const COLORS = useSelector((state) => state.designSetting);
  // GET INITIAL ITEMS FROM SERVER INTO STATE, THEN FROM STATE INTO AN ARRAY THAT WE CAN MAP:
  FetchInitItems();
  let catalogItems = useSelector(parseInitialItems);
  let loadStatus = useSelector(displayLoadState);

  // Styled components:

  return (
    <Wrapper>
      <SearchBar />
      <Title COLORS={COLORS}>Home</Title>
      <SubTitle COLORS={COLORS}>Sale!</SubTitle>
      <SaleItems>
        {loadStatus === 'complete' ? (
          catalogItems.saleItems.map((item) => {
            return <ItemCard product={item} />;
          })
        ) : (
          <></>
        )}
      </SaleItems>
      <SubTitle COLORS={COLORS}>Featured!</SubTitle>
      <ItemDisplay>
        {loadStatus === 'complete' ? (
          catalogItems.featuredItems.map((item) => {
            return <ItemCard product={item} />;
          })
        ) : (
          <></>
        )}
      </ItemDisplay>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: 'flex';
  flex-direction: 'column';
`;

const Title = styled.h2`
  padding: 0.5rem 1rem 0;
  text-align: center;
  color: ${(props) => props.COLORS.header};
  text-shadow: 4px 8px 25px #616161, 0px 4px 4px rgba(0, 0, 0, 0.3),
    1px 2px 2px rgba(0, 0, 0, 0.5);
`;

const SubTitle = styled(Title)`
  font-size: 1.2rem;
  text-align: left;
`;

const ItemDisplay = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const SaleItems = styled(ItemDisplay)`
  div {
    color: black;
  }
`;

export default Homepage;
