setTimeout(function () {
  $("#prof").typed({
    strings: ["frontend", "^1000 backend ^1000", "^1000 fullstack"],
    typeSpeed: 100
  });
}, 1000)

$(document).scroll(function () {
  if( $(this).scrollTop() > 20 ) {
    $('.header_top').addClass('fixed')
  }else{
      $('.header_top').removeClass('fixed');
  }
 });

$(document).ready(function () {
  $('.mobile_menu__toggle').click(function () {
    $(this).toggleClass('active').next().toggleClass('active');
    return false;
  });

  $('.b_portfolio__items').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  })



    // Remove the # from the hash, as different browsers may or may not include it
    var hash = location.hash.replace('#', '');

    if(hash != ''){
       // Clear the hash in the URL
       // location.hash = '';   // delete front "//" if you want to change the address bar

           console.log(hash);
       scrollTo(hash);
        $('html, body').animate({ scrollTop: $('#' + hash).offset().top - 250 }, 500);

       }


});

$(document).on('click', 'nav.index_nav a, .contact_href', function(event){
    event.preventDefault();
    if($( $.attr(this, 'href') ).length > 0){
      $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top - 250
      }, 500);
    }
});

window.addEventListener('scroll', function () {
  document.querySelectorAll('section').forEach(function (el, i) {
    var el_top = el.offsetTop;
    var window_scroll = window.pageYOffset;
    if(el_top >= (window_scroll - 280) && el_top <= (window_scroll + 280)){
      setActiveMenu(el.id);
    }
  });
});

document.querySelectorAll('.contact_form__input input, .contact_form__input textarea').forEach(function (el) {
  el.addEventListener('focus', function (e) {
    this.parentNode.classList.add("active");
  })
  el.addEventListener('focusout', function (e) {
    if(this.value == ''){
      this.parentNode.classList.remove("active");
    }

  })
});

function setActiveMenu(id) {
  document.querySelectorAll('.menu a').forEach(function (el) {
    el.className = '';
  });
  if(document.querySelector('.menu [href="#'+ id + '"]')){
    document.querySelector('.menu [href="#'+ id + '"]').classList.add("active");
  }
}

function scrollTo(anchor) {
  if($(anchor).length > 0){
    $('html, body').animate({
      scrollTop: $(anchor).offset().top - 120
    }, 500);
  }
}

/* FORM */
$(document).ready(function () {

  $('[data-validate]').submit(function () {
     var valid = validateForm($(this));
     console.log('submit');
     /* post goes here */
     return false;
  });

  function formSuccessModalOpen(res) {
    var remodal = $('[data-remodal-id=success_form]').remodal();
    remodal.open();
    setTimeout(function () {
        remodal.close();
    }, 2000);
  }


  $('[data-validate]').find('input, textarea').click(function () {
    $(this).removeClass('error');
    $(this).parent().removeClass('error');
  });

  function validateForm($form, ajaxSuccessCallback){
    var form = $form;
    var errors = {};
    var url = form.data().url;
    if(typeof url == 'undefined'){
      console.error('Form '+ form +'has no data-url');
      return false;
    }
    var inputs_rules = form.find('[data-rules]');

  if(inputs_rules.length > 0){
    form.find('[data-rules]').each(function () {

      var input = $(this);
      input.removeClass('error');
      input.parent().removeClass('error');
      var input_name = $(this).attr('name');
      var input_val = input.val();

      var is_valid = validateInput(input);

      if(!is_valid){
        input.parent().addClass('error');
        if(!errors[input_name]){
          errors[input_name] = {
            el: input,
            messages: {}
          };
        }
        //fix handle errors with validateInput
        //errors[input_name].messages[rule] = input.data().message;
      }


    });
  }else{
    console.error('There are no form rules');
  }

  console.log(errors);
  if($.isEmptyObject(errors)){
    console.log(form.serialize());
    // $.post(url, form.serialize(), function (res) {
    //   if(res.STATUS == 'OK'){
    //     form[0].reset();
    //     formSuccessModalOpen();
    //   }
    //   ajaxSuccessCallback(res);
    // });
    // FORM RESET!!!;
    formSuccessModalOpen();
    return false;
  }else{
    //handle_errors(errors);
    return false;
  }
}


function validateInput($input) {
  if($input.attr('data-rules')){
    var isValid = true;

    var types = $input.attr('data-rules').split(',').filter(function (v) {
      return v.trim() ? v : null;
    }).map(function (v) {
      return v.trim();
    });

    if(types.length > 0){
      types.forEach(function (type) {
        if(!isValidRule($input.val(), type, $input)){
          isValid = false;
        }
      });
    }

    return isValid;
  }
}

  var isValidRule = function (val, type, $el) {
    switch (type) {
      case 'email':
        var re = /.*@[^,]+\.[A-Za-zА-Яа-я]*$/;
        return re.test(val);
        break;

      // case 'phone':
      //   if($el.inputmask("isComplete")){
      //     return true;
      //   }else{
      //     return false;
      //   }
      //   break;

      case 'inputmask':
        if($el.inputmask("isComplete")){
          return true;
        }else{
          return false;
        }
        break;

      case 'required':
        return (val != '') ? true : false;
        break;

      default:
        return false;
    }
  }

  var handle_errors = function (errors) {
    if(!$.isEmptyObject(errors)){
      for(var error in errors){
        if (errors.hasOwnProperty(error)) {
          errors[error].el.addClass('error');
        }
      }
    }
  }

});
