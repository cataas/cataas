export const context = 'app'

export const route = {
  method: 'get',
  path: '/404'
}

export const handler = ({ view }) => {
  return view.render('error/404')
}
