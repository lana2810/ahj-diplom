# Дипломное задание к курсу «Продвинутый JavaScript в браузере». Chaos Organizer

---

Пользователь может использовать следующие функции приложения:

- Ввод текстовых заметок
- Запись аудио/видео сообщений
- Запись файлов любых расширений при помощи иконки загрузки файла или drag and drop
- Возможность выбрать заметки определенного типа

---

Описание приложения

- заметки подгружаются по 10 штук, как только пользователь их прокрутил, подгружаются следующие 10.
- сервер отдает данные по переданному фильтру(all/video/audio/text/piture)
- пользователь может отсортировать все заметки по их типу - картинки/аудио/видео/заметки/ и все заметки отмеченные как избранные
- также пользователь может посмотреть все сохраненные ссылки
- для отмены фильтра пользователь должен использовать иконку домой в хедере приложении

---

Описание заметки

- При создании заметки добавлется запись в файл note.json запись о заметке
- Если заметка файл - то он записывается в папку PUBLIC на сервере (имя файла сохранется и добавлется в начало имени дата), если заметка текст/видео/аудио то файл создается и также записывается в папку PUBLIC
- при создании заметки фиксируется геолокаци пользователя, отображается в виде массива координат и при нажатии иконки открывается карта с точкой геолокации. При запрете пользователя геолокаци не записывается в заметку и соответственно не отображается
- пользователь может отметить заметку как избранную. Изменения данных записываются на сервер
- пользователь может сделать заметку закрепленной, путем нажатия иконки
- пользователь может удалить заметку. Удалится запись в файле note.json и соответствующий файл на сервере
- также отображается отформатированная дата создания заметки

---

Текстовые заметки

- при создании текстовой заметки на сервере создается тестовой файл
- при создании или подгрузке текствого файла - текст проверется на наличие ссылок. При создании новой текстовой заметки, все найденные ссылки загружаются в файл links.json на сервере
- при подгрузки текстового файла его содержимое считывается и изображается в заметке. Все ссылки в тексте оформлены как ссылки

---

Аудио/Видео заметки

- пользователь может записать видео/аудио заметку
- при создании видео заметки, видеопоток отображается при записи
- при видео/аудио работает таймер
- на сервере создается соответствующий файл
- при подгрузке видео/аудио файлов отображается их содержимое

[Демонстрация работы приложения](https://drive.google.com/file/d/15Zs6T6DkvO8nZU2LPOz4XDhnG_ZIhcvg/view?usp=sharing)