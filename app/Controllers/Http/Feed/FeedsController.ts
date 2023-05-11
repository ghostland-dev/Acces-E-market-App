import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import '@ioc:Adonis/Core/BodyParser'

export default class FeedsController {
  public async newsFlow({ response, request, params, view, session, auth }: HttpContextContract) {

    let query = request.all()?.query || "energie";
    try {
      const { data } = await axios.get(`https://free-news.p.rapidapi.com/v1/search?q=${encodeURIComponent(query)}&lang=fr`, {
        headers: {
          'X-RapidAPI-Host': 'free-news.p.rapidapi.com',
          'X-RapidAPI-Key': 'a76be59b22msha21a0b1d33c9faap1a235bjsneb32dc3d1ace',
        },
      });
      let articles = data.articles;


      return view.render('pages/articles/index', { articles })
    } catch (error) {
      console.error(error)
      let articles = {}
      return view.render('pages/articles/index', { articles })
    }


  }
}
