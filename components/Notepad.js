import TextArea from './styles/TextArea';
import useLocalStorage from '../lib/useLocalStorage';
import useTextArea from '../lib/useTextArea';

const SPACEBAR_KEY = ' ';

const getLastWord = (content, textarea) => {
  const contentSplit = content.split('');
  const notesSelectionStart = textarea.current.selectionStart;
  let spaceIndex = -1;
  for (let i = notesSelectionStart; i > -1; i--) {
    if (i === notesSelectionStart && (contentSplit[i] === ' ' || contentSplit[i] === '\n')) continue;
    if (contentSplit[i] === ' ' || contentSplit[i] === '\n') {
      spaceIndex = i;
      break;
    }
  }
  let lastWord = '';
  for (let i = spaceIndex + 1; i < notesSelectionStart; i++) lastWord += contentSplit[i];
  return lastWord;
};

export default () => {
  const [theme] = useLocalStorage('theme', '');
  const [content, setContent] = useLocalStorage('content', '');
  const [commandKey, setCommandKey] = useLocalStorage('command', '!');
  const { textarea, executeCommand } = useTextArea({ content, setContent, commandKey, setCommandKey });
  //   const textarea = useRef(null);
  //   const replace = async (string, newString) => {
  //     const { selectionStart } = textarea.current;
  //     const newContent = content.replace(string, newString);
  //     await setContent(newContent);
  //     const newSelectionStart = selectionStart + (newString.length - string.length);
  //     textarea.current.selectionStart = newSelectionStart;
  //     textarea.current.selectionEnd = newSelectionStart;
  //   };

  //   const executeCommand = lastWord => {
  //     const [command, ...args] = lastWord.replace(commandKey, '').split('-');

  //     console.log({ command, args });
  //     if (command) {
  //       switch (command) {
  //         case 'c': {
  //           setContent('');
  //           break;
  //         }
  //         case 'nba': {
  //           replace(
  //             lastWord,
  //             `PG:
  // SG:
  // SF:
  // PF:
  // C: `
  //           );
  //           break;
  //         }
  //         case 'setcmd': {
  //           replace(lastWord, '');
  //           setCommandKey(args[0]);
  //           break;
  //         }
  //         case 'go': {
  //           replace(lastWord, '');
  //           Router.push(`/${args[0] || ''}`);
  //           break;
  //         }
  //         default:
  //           // loadNote(command)
  //           break;
  //       }
  //     }
  //   };
  const handleChange = e => setContent(e.target.value);
  const handleKeyDown = e => {
    const { key, ctrlKey } = e;
    if (key === SPACEBAR_KEY) {
      const lastWord = getLastWord(content, textarea);
      if (lastWord.length > 0 && lastWord.startsWith(commandKey)) {
        e.preventDefault();
        executeCommand(lastWord);
      } else if (lastWord.includes(':')) {
        console.log('fetch text');
      }
    }
  };
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
