export const context = 'app'

export const route = {
  method: 'get',
  pattern: '/upload'
}

export const handler = ({ view }) => {
  return view.render('upload')
}
