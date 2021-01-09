[![Netlify Status](https://api.netlify.com/api/v1/badges/bbf2370e-4608-40df-ad73-7275c6b71429/deploy-status)](https://app.netlify.com/sites/xenodochial-bardeen-1a88d2/deploys)

# Справочник

Для разметки контента используется markdown, собирается сайт движком MKDocs.

## Участие

Чтобы исправить ошибку или добавить что-то новое в этот репозиторий, вам нужно открыть пулл-реквест на Гитхабе.
Кроме того, на каждой странице сайта справа от заголовка есть иконка редактирования (карандаш).

## Сборка справочника

Для сборки справочника нужно [установить MKDocs](https://www.mkdocs.org/#installation),
[расширения PyMdown](https://facelessuser.github.io/pymdown-extensions/installation/) и тему [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/):

```
pip3 install -r ./requirements.txt
```

Сборка проекта:

```
mkdocs build
```

Режим разработчика:

```
mkdocs serve --dirtyreload
```
