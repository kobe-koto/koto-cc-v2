/*
 * Copyright kobe-koto, Under AGPL-3.0.
 */

/**
 * func for flying page, same origin only.
 * @param TargetURL
 */
if (
    window.XMLHttpRequest && window.DOMParser
) {
    window.location.flying = function (TargetURL) {
        var TargetURLObject = toURLObj(TargetURL);

        if (TargetURLObject === "notValid" || TargetURLObject.hostname === location.hostname) {

            // 用進度條表示加載進度。
            var xhr = new XMLHttpRequest();
            xhr.open("GET", TargetURL, true);

            xhr.onerror = function () {
                location.assign(TargetURL)
            }

            xhr.onload = function () {
                if (this.status === 200) {
                    var TempParser = new DOMParser();
                    var TargetDOM = TempParser.parseFromString(this.response, "text/html");
                    document.title = TargetDOM.title;
                    document.querySelector("div.container").innerHTML = TargetDOM.querySelector("div.container").innerHTML;

                    // sync the body attributes.
                    let TargetAttr = TargetDOM.body.attributes,
                        BodyAttr = document.body.attributes;

                    TargetDOM.body.setAttribute("theme", BodyAttr.theme.value)

                    for (let i=0; i<BodyAttr.length; i++) {
                        document.body.removeAttribute(BodyAttr[i].name);
                        i=0;
                    }
                    for (let i=0; i< TargetAttr.length; i++) {
                        document.body.setAttribute(TargetAttr[i].name, TargetAttr[i].value)
                    }


                    // sync the css
                    let TargetCSSs = TargetDOM.querySelectorAll("link[rel=\"stylesheet\"]"),
                        BodyCSSs = document.querySelectorAll("link[rel=\"stylesheet\"]");
                    for (let i=0; i<BodyCSSs.length; i++) {
                        BodyCSSs[i].remove();
                    }
                    for (let i=0; i< TargetCSSs.length; i++) {
                        let CSSElement = document.createElement("link");
                        CSSElement.rel = "stylesheet";
                        CSSElement.type = "text/css";
                        CSSElement.href = TargetCSSs[i].href;
                        document.getElementsByTagName("head")[0].appendChild(CSSElement)
                    }
                    







                    history.pushState({}, "0", TargetURL)
                    document.getElementsByClassName("FlyingPageProcessor")[0].style.width = "0%";
                    DOMLoadedEval()
                } else if (this.status === 404 || this.status === 403) {
                    location.assign(TargetURL)
                } else {
                    alert("A Network error caught, Status Code:" + this.status)
                }
            }

            xhr.onprogress = function (event) {
                if (event.lengthComputable) {
                    document.getElementsByClassName("FlyingPageProcessor")[0].style.width =
                        (event.loaded / event.total * 100) + "%";
                }
            }

            xhr.send();
            document.getElementsByClassName("FlyingPageProcessor")[0].style.width = "5%";
        } else {
            location.assign(TargetURL)
        }
    }
} else {
    location.flying = location.assign;
}
function toURLObj (Strings) {
    try {
        return new URL(Strings)
    } catch (e) {
        return "notValid"
    }
}

if (
    document.querySelectorAll &&
    window.XMLHttpRequest && window.DOMParser
) {
    function DOMLoadedEval () {
        // FlyingPage inject.
        let Links2Fly = document.querySelectorAll("a[href]");
        for (var i=0; i<Links2Fly.length; i++) {
            let link = toURLObj(Links2Fly[i].href);
            if (link === "notValid" || link.hostname === location.hostname) {
                Links2Fly[i].href = "javascript:location.flying('" + Links2Fly[i].href + "')"
            }
        }
        if (!document.getElementsByClassName("FlyingPageProcessor")[0]) {
            document.getElementsByTagName("header")[0].innerHTML +=
                "<div class=\"FlyingPageProcessorContainer\">" +
                "    <div class=\"FlyingPageProcessor\"></div>" +
                "</div>";
        }
    }
    addEventListener("DOMContentLoaded", DOMLoadedEval)
}
