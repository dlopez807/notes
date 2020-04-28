import TextArea from './styles/TextArea';
import useTextArea from '../lib/useTextArea';

export default () => {
  const { textarea, content, handleChange, handleKeyDown, theme } = useTextArea();

  return (
    <TextArea
      ref={textarea}
      placeholder="notepad"
      name="content"
      value={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={theme}
      autoFocus
      onFocus={e => {
        const temp = e.target.value;
        e.target.value = '';
        e.target.value = temp;
      }}
    />
  );
};
