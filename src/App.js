import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';
import './App.css';

function App() {
  const nodeRef = React.useRef(null); //  настройка для новой версии Draggable
  const [item, setItem] = useState('');
  const [items, setItems] = useState( //помещается в local Storage
    JSON.parse(localStorage.getItem('items')) || [] //получаем элемент из item, если там ничего нет то будет пустой массив
  )

  useEffect(() => { // принимает callback
    localStorage.setItem('items', JSON.stringify(items)) // создание массива items
  }, [items])  // когда только обновляются элементы items то срабатывает useEffect

  const newItem = () => {
    if (item.trim() !== '') {  // если не = пустой строке
      const newItem = {
        id: v4(),
        item: item,  // если совпадают св-во и назание то можно писать одно слово item
        color: randomColor({
          luminosity: 'light'
        }),
        defaultPos: {
          x: 700,
          y: -800
        }
      }
      setItems((items) => [...items, newItem]) // разворачиаем массив item и добавляем newItem
      setItem('') // очищаем value input

    } else {  // если input пустой
      alert('Введите что нибудь...')
      setItem('')
    }
  }

  const deleteNode = (id)=> { // удаление по нажатию и сверке id элемента
     // если элемент массива совпадает с выбранным id
    setItems(items.filter((item)=> item.id !== id)) // метод filter возвращает рузультатом новый массив
  }

  const updatePos = (data,index) => {
    let newArray = [...items] //берем весь массив и обновляем у него координаты
    newArray[index].defaultPos = {x: data.x, y: data.y}
    setItems(newArray) // обновляем с выводом нового массива
  }

  const keyPress = (e) =>{
    const code = e.keyCode || e.which //для поддержки старых браузеров
      if (code === 13) {
        newItem()
      }
  }

// ПОЧЕМУ ЕСЛИ ПИСАТЬ === id то не удаляет последний элемент????
  
  return (
    <div className="App">
      <div className='wrapper'>
        <input
          value={item}
          type="text"
          placeholder='Введите что нибудь...'
          onChange={(e) => setItem(e.target.value)} //вешаем callback
          onKeyPress={(e)=> keyPress(e)}
        />
        <button className='enter' onClick={newItem}>Enter</button>
      </div>
      {

        items.map((item, index) => {


          return (
            <Draggable
              nodeRef={nodeRef}
              key={index}
              defaultPosition={item.defaultPos}
              onStop={(_, data)=> {   // метод сохраняет позицию через callback
                  updatePos(data,index)
              }}
            >
              <div ref={nodeRef}
                className="todo__item"
                style={{ backgroundColor: item.color }}>
                {`${item.item}`}
                <button className="delete"
                  onClick={() => deleteNode(item.id)}
                >
                  x
                </button>
              </div>
            </Draggable>
          )
        })
      }
    </div>
  );
}
export default App;


