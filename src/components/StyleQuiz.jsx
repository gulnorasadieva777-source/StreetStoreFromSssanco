import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { sampleItems } from "../data/items"

const questions = [
  {
    id: "music",
    question: "Какая музыка сейчас в твоем плейлисте?",
    options: [
      { value: "trap", label: "Trap / Рэп", scores: { trap: 2, cyber: 1, classic: 0, chill: 0 } },
      { value: "techno", label: "Techno / EDM", scores: { cyber: 2, trap: 1, classic: 0, chill: 0 } },
      { value: "lofi", label: "Lo-fi / Чилл", scores: { chill: 2, classic: 1, trap: 0, cyber: 0 } },
      { value: "indie", label: "Indie / Альтернатива", scores: { chill: 2, classic: 1, cyber: 0, trap: 0 } },
    ],
  },
  {
    id: "silhouette",
    question: "Какой силуэт ты выбираешь?",
    options: [
      { value: "oversize", label: "Oversize", scores: { trap: 2, classic: 1, cyber: 0, chill: 0 } },
      { value: "slim", label: "Slim fit", scores: { cyber: 2, chill: 1, classic: 0, trap: 0 } },
      { value: "athleisure", label: "Athleisure", scores: { trap: 1, cyber: 1, chill: 0, classic: 0 } },
      { value: "layered", label: "Слои и текстуры", scores: { cyber: 2, trap: 1, chill: 0, classic: 0 } },
    ],
  },
  {
    id: "place",
    question: "Куда ты чаще всего выходишь?",
    options: [
      { value: "street", label: "На улицу с друзьями", scores: { classic: 2, trap: 1, cyber: 0, chill: 0 } },
      { value: "club", label: "В клуб / бар", scores: { cyber: 2, trap: 1, chill: 0, classic: 0 } },
      { value: "study", label: "В универ / на работу", scores: { chill: 2, classic: 1, trap: 0, cyber: 0 } },
      { value: "walk", label: "Для прогулки по городу", scores: { classic: 1, chill: 1, trap: 0, cyber: 0 } },
    ],
  },
  {
    id: "piece",
    question: "Что ты берешь в первый раз из новой коллекции?",
    options: [
      { value: "hoodie", label: "Худи", scores: { trap: 2, chill: 1, classic: 0, cyber: 0 } },
      { value: "sneakers", label: "Кроссовки", scores: { cyber: 2, classic: 1, trap: 0, chill: 0 } },
      { value: "tshirt", label: "Футболку", scores: { classic: 1, chill: 1, trap: 0, cyber: 0 } },
      { value: "accessory", label: "Аксессуар", scores: { cyber: 1, trap: 1, chill: 0, classic: 0 } },
    ],
  },
]

const stylesInfo = {
  trap: {
    title: "Твой стиль: Трэп-минимализм",
    description: "Тебе идут свободный крой, темные оттенки и минималистичные детали. Мы рекомендуем вещи, которые сразу создают сильный вайб.",
    categories: ["tshirts", "tshirts-women"],
    links: [
      { label: "Футболки Oversize", href: "/?category=tshirts" },
      { label: "Худи в уличном стиле", href: "/?category=hoodies" },
      { label: "Аксессуары в стиле trap", href: "/?category=accessories" },
    ],
  },
  cyber: {
    title: "Твой стиль: Cyber Techno",
    description: "Ты выбираешь неон, смелые линии и футуристичные детали. Идеально для тех, кто любит выглядеть как герой киберпанк-вечеринки.",
    categories: ["tshirts", "tshirts-women"],
    links: [
      { label: "Футболки Cyber", href: "/?category=tshirts" },
      { label: "Стиль Techno", href: "/?category=hoodies" },
      { label: "Неоновые акценты", href: "/?category=accessories" },
    ],
  },
  chill: {
    title: "Твой стиль: Ло-фай чилл",
    description: "Мягкий комфорт, спокойные оттенки и свободный крой. Твой набор — это вещи, которые легко носить каждый день.",
    categories: ["tshirts", "tshirts-women"],
    links: [
      { label: "Легкие футболки", href: "/?category=tshirts" },
      { label: "Сдержанные образы", href: "/?category=hoodies" },
      { label: "Удобные аксессуары", href: "/?category=accessories" },
    ],
  },
  classic: {
    title: "Твой стиль: Street Classic",
    description: "Четкие линии, базовые вещи и уверенный городской вайб. Это образ для тех, кто любит быть в теме, но без лишнего шума.",
    categories: ["tshirts", "tshirts-women"],
    links: [
      { label: "Классические футболки", href: "/?category=tshirts" },
      { label: "Повседневный стиль", href: "/?category=hoodies" },
      { label: "Городской минимализм", href: "/?category=accessories" },
    ],
  },
}

function calculateStyle(answers) {
  const scores = { trap: 0, cyber: 0, chill: 0, classic: 0 }
  questions.forEach((question) => {
    const selected = answers[question.id]
    const option = question.options.find((item) => item.value === selected)
    if (option) {
      Object.entries(option.scores).forEach(([key, value]) => {
        scores[key] += value
      })
    }
  })
  return Object.keys(scores).reduce((best, key) => {
    return scores[key] > scores[best] ? key : best
  }, "trap")
}

export default function StyleQuiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [resultKey, setResultKey] = useState(null)

  const canSubmit = questions.every((q) => answers[q.id])

  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return
    const key = calculateStyle(answers)
    setResultKey(key)
    setSubmitted(true)
  }

  function handleReset() {
    setAnswers({})
    setSubmitted(false)
    setResultKey(null)
  }

  const result = resultKey ? stylesInfo[resultKey] : null

  const recommended = useMemo(() => {
    if (!result) return []
    return sampleItems
      .filter((item) => result.categories.includes(item.category))
      .slice(0, 3)
  }, [result])

  return (
    <section className="style-quiz">
      <div className="style-quiz-inner">
        <div className="quiz-header">
          <span className="quiz-label">Найди свой стиль</span>
          <h2>Интерактивный квиз для твоего streetwear-варианта</h2>
          <p>Ответь на 4 вопроса, и мы подберем готовый лук с подходящими вещами.</p>
        </div>

        {!submitted ? (
          <form className="quiz-form" onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div className="quiz-step" key={question.id}>
                <p className="quiz-question">{question.question}</p>
                <div className="quiz-options">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`quiz-option ${answers[question.id] === option.value ? "selected" : ""}`}
                      onClick={() => handleAnswer(question.id, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="shop-cta" disabled={!canSubmit}>
              Узнать стиль
            </button>
          </form>
        ) : (
          <div className="quiz-result">
            <div className="quiz-result-badge">{result?.title}</div>
            <p>{result?.description}</p>
            <div className="quiz-links">
              {result?.links.map((link) => (
                <Link key={link.href} to={link.href} className="shop-outline">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="quiz-cards">
              {recommended.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="quiz-card">
                  <div className="quiz-card-image-wrapper">
                    <img src={encodeURI('/img/' + item.image)} alt={item.name} />
                  </div>
                  <div className="quiz-card-info">
                    <div className="quiz-card-name">{item.name}</div>
                    <div className="quiz-card-price">{item.price.toLocaleString('ru-RU')} сум</div>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" className="shop-outline" onClick={handleReset}>
              Пройти снова
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
