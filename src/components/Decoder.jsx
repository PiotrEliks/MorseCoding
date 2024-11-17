import React, { useState } from 'react'
import styles from './Decoder.module.css'
import { ImAttachment } from "react-icons/im";
import { TbXboxX } from "react-icons/tb";

const Form = ({ setType }) => {
    const [message, setMessage] = useState('');
    const [isAttached, setIsAttached] = useState(false);
    const [isDecoded, setIsDecoded] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const morseCode = {
        "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
        "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
        "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
        "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
        "Y": "-.--", "Z": "--..",
        "Ą": ".-.-", "Ć": "-.-..", "Ę": "..-..", "Ł": ".-..-", "Ń": "--.--",
        "Ó": "---.", "Ś": "...-...", "Ż": "--..-.", "Ź": "--..-",
        "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
        "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
        ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", ":": "---...",
        ";": "-.-.-.", "'": ".----.", "\"": ".-..-.", "-": "-....-", "/": "-..-.",
        "(": "-.--.", ")": "-.--.-", "&": ".-...", "=": "-...-", "+": ".-.-.",
        "_": "..--.-", "$": "...-..-", "@": ".--.-.",
        " ": "|"
    };
    const [fileContent, setFileContent] = useState('');

    const parseMorseXML = (xmlText) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
        const messages = xmlDoc.getElementsByTagName("Message");

        const results = [];
        for (let message of messages) {
            const morseCode = message.textContent;
            results.push(morseCode);
        }
        return results;
    };

  const handleFileChange = (event) => {
    event.preventDefault();
    setIsDecoded(false);
    const file = event.target.files[0];
    const xsdContent = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="MorseMessages"><xs:complexType><xs:sequence><xs:element name="Message" type="xs:string" maxOccurs="unbounded"/></xs:sequence></xs:complexType></xs:element></xs:schema>';
    if (file && file.name.endsWith('.xml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const xmlContent = e.target.result.toString();
        const validationResult = window.xmllint.validateXML({
          xml: xmlContent,
          schema: xsdContent
        });
        if (validationResult.errors === null || validationResult.errors.length === 0) {
          setFileContent(parseMorseXML(xmlContent));
          setIsAttached(true);
          setIsValid(true);
        } else {
          alert("Validation error: \n" + validationResult.errors.join('\n'));
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a .xml file');
    }
  };

  const handleDecoder = () => {
    setIsAttached(false);
    setMessage(decodeMorse(fileContent + ''));
    setIsDecoded(true);
  };

  const morseCodeReverse = Object.fromEntries(
    Object.entries(morseCode).map(([letter, morse]) => [morse, letter])
  );

  const decodeMorse = (morseText) => {
    return morseText.split(" ").map(morse => morseCodeReverse[morse] || "").join("");
  };

  return (
    <div className={styles.form}>
      <button onClick={() => setType('default')} className={styles.closeBtn}><TbXboxX className={styles.closeIcon}/></button>
        {isValid &&
          <p>Plik xml zgodny z plikiem xsd</p>
        }
        {isAttached ? (
            <>
                <div className={styles.fileContent}>
                    <p className={styles.message}>Zakodowana wiadomość:</p>
                    <p className={styles.messageText}>{fileContent}</p>
                </div>
                <button onClick={handleDecoder} className={styles.submitBtn}>Odkoduj</button>
            </>

      ) : (
        <div>
            <label className={styles.label}>Dołącz plik XML</label>
            <label className={styles.fileButton}>
                <ImAttachment />
                <input type="file" accept=".xml" onChange={handleFileChange} style={{ display: 'none' }} className={styles.attachment}/>
            </label>
        </div>
    )}
    {isDecoded && <div><p className={styles.message}>Odkodowana wiadomość:</p><p className={styles.messageText}>{message}</p></div>}
    </div>
  )
}

export default Form