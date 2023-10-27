<?
// ini_set('display_errors', 1);
// error_reporting(E_ALL);
// ini_set("display_errors", 1);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Spatie\YamlFrontMatter\Parser as YFMP;

require '../vendor/autoload.php';
require 'config.php';

/* pages */
function parsePage($path){
  $page = array();
  $yfm_parser = new YFMP();
  $parsedown = new Parsedown();
  $file_content = file_get_contents($path);
  $objFileContent = $yfm_parser -> parse($file_content);
  $page = $objFileContent -> matter();
  $page['id'] = explode('.',basename($path))[0];
  $page['body'] = $parsedown->text( $objFileContent->body() );
  return $page;
}

function getPages(){
  $files = array();
  foreach (glob(__DIR__."/pages/*.md") as $file) {
    $page = parsePage($file);
    $files[] = $page;
  }
  return $files;
}



$app->get('/', function ($request, $response) {
  //  $name = $request->getAttribute('name');
  //  $response->getBody()->write("Hello, $name");
  return $this->view->render($response, 'index.twig', [
    'pages' => getPages()
  ]);
});

$app->get('/work/{id}', function ($request, $response) {
  $id = $request->getAttribute('id');
  $pages = getPages();


  $requested_page = false;
  foreach ($pages as $k => &$page) {
    if(isset($pages[$k+1])){
      $page['next_link'] = '/work/'.$pages[$k+1]['id'];
     }
    if(isset($pages[$k-1])){
      $page['prev_link'] = '/work/'.$pages[$k-1]['id'];
     }
    if($page['id'] == $id){
      $requested_page = $page;
    }
  }


  if($requested_page){
    return $this->view->render($response, 'detail_work.twig', [
      'page' => $requested_page
    ]);
  }else{
    return $this->view->render($response->withStatus(404), '404.twig');
  }

});


$app->run();
