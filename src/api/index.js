import request from '../utils/request'
import resource from './resource'

export default function(name, params, other={}){
  if(name.slice(0,4) === 'http'){
    let arg={
      url:name,
      params,
      other
    }
    return request(arg)
  }else{
    let path = name.split('.')
    let apiArgs = resource
    path.forEach(function(item){
      if(typeof apiArgs == 'undefined'){
        throw Error('无对应接口')
      }
      apiArgs = apiArgs[item]
    })
    if(typeof apiArgs == 'object'){
      let arg ={
        url:apiArgs.url,
        method:apiArgs.method,
        params,
        other
      }
      return request(arg)
    }
  }
}