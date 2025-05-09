import React from 'react';
import '../App.scss';
import { Link } from 'react-router-dom';

const FirstPage = () => {
  return (
    <section className="content">
      <div className="hi-user">
        <h1>
          Привет, Пользователь:) <br />
          Добро пожаловать в Todoist!
        </h1>
        <div className="about">
          <div className="fl">
            <p>
              На данном сайте ты научишься планировать <br />
              правильно и точно свои задачи и цели. <br />
              Вместе со своей командой вы будите знать <br />
              как построить правильно ваш проект или глобальные идеи <br />
              для продвижения !
            </p>
            <img className="" src="/img/pict1.png" alt="" />
          </div>
          <div className="btn-reg">
            <Link to="/register">Пройти регистрацию</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstPage;
