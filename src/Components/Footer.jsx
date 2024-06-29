import styled from 'styled-components';

const Footer = (props) => {
  return (
    <Container>
      <Content>
        <Left>
            <p>© 2023 Coding Track YouTube Channel. All rights reserved.</p>
        </Left>
        <Right>
          <a href="/">
            Fast<span>News.</span>
          </a>
        </Right>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  background: #44444448;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 150px;

  @media screen and (max-width: 768px){
    padding: 30px 20px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  p{
    font-size: 18px;
  }
 
  @media screen and (max-width: 768px){
    p {
        font-size: 14px;
    }
  }

`;


const Right = styled.div`
  a {
    text-decoration: none;
    font-size: 30px;
    letter-spacing: 1px;
    color: #ededed;
    cursor: pointer;

    span {
      font-size: 25px;
      color: #c6c4c4;
    }
  }
  @media screen and (max-width: 768px) {
    a {
      font-size: 25px;
      span {
        font-size: 20px;
      }
    }
  }
`;

export default Footer;
