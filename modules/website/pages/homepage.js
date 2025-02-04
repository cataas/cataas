export const context = 'app'

export const route = {
  method: 'get',
  pattern: '/'
}

export const handler = ({ view }) => {
  return view.render('homepage')
}
