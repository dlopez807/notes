import styled from 'styled-components'

export default styled.div`
  display: block;
  width: 100%;
  border-radius: 5px;
  /* height: 1.25rem; */
  height: 100vh;

  /* background: pink; */
  background-image: linear-gradient(270deg, #193549, #333333, #333333, #193549);
  /* background-image: linear-gradient(
    270deg,
    var(--accents-1),
    var(--accents-2),
    var(--accents-2),
    var(--accents-1)
  ); */
  background-size: 400% 100%;
  animation: loading 8s ease-in-out infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`
