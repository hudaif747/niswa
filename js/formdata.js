var $form = $("form#form-submission"),
  // url = 'https://script.google.com/macros/s/AKfycbywA_8KY-ReVkp-7U4SCfqtjgmNIXjlfuPy5GKUJLx84KIYTr8/exec'; !!ORIGINAL!!
  // url = 'https://script.google.com/macros/s/AKfycbzUOSIpIwOzk8h770GkK9GaMqTNYG8KKG7JKaFCn0X7USx0SnGl/exec';
  // url = 'https://script.google.com/macros/s/AKfycbxNUJLNS8sVOx7Vb7B0AkIHVFocABWEkx-OWcS4j_DYnx0b5MU/exec';
  url =
    "https://script.google.com/macros/s/AKfycbyZE02HVtN2oaI69RXBJcajenT-MbuIhpRBfw5_SWo_v_YP7bo/exec";

// code for serializeObject

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

$form.validate({
  rules: {
    Name: "required",
    Gender: "required",
    Age: "required",
    "Whatsapp-Number": "required",
    "Contact-Number": "required",
    Code1: "required",
    Code2: "required",
    Country: "required",
    State: "required",
    District: "required",
    Place: "required",
    Participated: "required",
  },
});

function fire(res, json) {
  var pid = res.razorpay_payment_id;
  json.Payment_ID = pid;
  json.Status = "Success";
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: json,
  }).success(
    // do something
    onSuccess(pid)
  );
}

$("#form-submit").on("click", function (e) {
  e.preventDefault();
  const json_data = $form.serializeObject();
  json_data["Contact-Number"] = "+" + $("#code1").val() + $("#contact").val();
  json_data["Whatsapp-Number"] = "+" + $("#code2").val() + $("#whatsapp").val();

  console.log(json_data);
  if ($form.valid() && $("#gender").val() === "Female") {
    $(".overlay2").css({
      visibility: "visible",
      opacity: "1",
      "z-index": "99",
    });

    $("#rzpay").on("click", function (e) {
      e.preventDefault();
      $(".overlay2").css({
        visibility: "hidden",
        opacity: "0",
        "z-index": "-1",
      });
      json_data.Confirmation = "Pay Now";
      var options = {
        key: rzp_key,
        amount: 40000, // Example: 2000 paise = INR 20
        name: "Niswa by Radio Islam",
        description: "Course Fee for Niswa by Radio Islam",
        image: "images/logo.png", // COMPANY LOGO
        handler: function (response) {
          if (response.error === undefined) {
            console.log(response);
            fire(response, json_data);
          } else {
            console.log(response.error);
            json_data.Description = response.error.description;
            json_data.Payment_ID = response.error.metadata.payment_id;
            json_data.Status = "Failed";
            var jqxhr = $.ajax({
              url: url,
              method: "GET",
              dataType: "json",
              data: json_data,
              success: function () {
                alert(response.error.description);
              },
            });
          }
          // AFTER TRANSACTION IS COMPLETE YOU WILL GET THE RESPONSE HERE.
        },
        prefill: {
          name: "Your Name", // pass customer name
          email: "you@example.com", // customer email
          // "contact": '+918848888121' //customer phone no.
        },
        // "notes": {
        //     "address": "address" //customer address
        // },
        theme: {
          color: "#ed008c", // screen color
        },
      };
      // console.log(options);
      var propay = new Razorpay(options);
      propay.open();
    });

    $("#paylater").on("click", function (e) {
      e.preventDefault();
      $(".overlay2").css({
        visibility: "hidden",
        opacity: "0",
        "z-index": "-1",
      });
      json_data.Confirmation = "Pay Later";
      var jqxhr = $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        data: json_data,
      }).success(
        // do something
        onSuccess2()
      );
    });
  }
});

function phphelper(response) {
  // response = JSON.parse(response)
  console.log(response);
}

function onSuccess(pid) {
  $form.trigger("reset");
  $("#pid").html(pid);
  $(".overlay1").css({
    visibility: "visible",
    opacity: "1",
  });
}

function onSuccess2() {
  $form.trigger("reset");
  $(".content").html("");
  $(".overlay1").css({
    visibility: "visible",
    opacity: "1",
  });
}

function onXClick() {
  $(".overlay").css({
    visibility: "hidden",
    opacity: "0",
  });

  window.location = "index.php";
}
