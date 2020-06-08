import styled from 'styled-components'

export default styled.div`
  display: block;
  width: 100%;
  /* border-radius: 5px; */
  /* height: 1.25rem; */
  /* height: 100vh; */
  height: ${props => props.height || 'auto'};

  /* background: pink; */
  /* background-image: ${props =>
    props.background
      ? `linear-gradient(270deg, ${props.background}, #333333, #333333, ${
          props.background
        })`
      : 'linear-gradient(270deg, #193549, #333333, #333333, #193549)'}; */
  background-image: ${props =>
    props.background
      ? `linear-gradient(270deg, #333333, ${props.background}, ${
          props.background
        }, #333333)`
      : 'linear-gradient(270deg, #193549, #333333, #333333, #193549)'};
  border-radius: ${props => props.borderRadius};
  /* background-image: linear-gradient(270deg, #333333, #193549, #193549, #333333); */
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
