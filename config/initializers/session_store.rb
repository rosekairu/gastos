if Rails.env == "Production"
    Rails.application.config.session_store :cookie_store, key: "_gastos", domain: "gastos.herokuapp.com"
else
    Rails.application.config.session_store :cookie_store, key:"_gastos"
end