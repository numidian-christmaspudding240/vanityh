import { defineComponent, h, ref } from "vue";
import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";
import vueLogo from "../assets/vue.svg";

import createVanity from "../../../src";

const { x, img, header, section, div, p, code, ul, li, a, svg, use } = createVanity(h);

const DemoFuncCom = x(({ text }: { text: string }) => div("DemoFuncCom text: ", text));

const DemoSetupCom = x(
  defineComponent((props) => () => div("DemoSetupCom text: ", props.text), {
    props: { text: String },
  }),
);

export default defineComponent(() => {
  const count = ref(0);
  return () =>
    div(
      section.id("center")(
        div.class("hero")(
          div.class("base")(img.src(heroImg).width(170).height(179).alt("Hero image")()),
          div.class("framework")(img.src(vueLogo).alt("Vue logo")()),
          div.class("vite")(img.src(viteLogo).alt("Vite logo")()),
        ),
        div(
          header("Get started"),
          p("Edit ", code("src/components/HelloWorld.ts"), " and save to test ", code("HMR")),
        ),
        p.class("counter").onClick(() => count.value++)(`Count is ${count.value}`),
      ),

      div.class("ticks")(),

      DemoFuncCom.text("PropValue")(),
      DemoSetupCom.text("PropValue")(),

      div.class("ticks")(),

      section.id("next-steps")(
        div.id("docs")(
          div.class("icon")(img.src("/icons.svg#documentation-icon").alt("Documentation icon")()),
          header("Documentation"),
          p("Your questions, answered"),
          ul(
            li(
              a.href("https://vite.dev/").target("_blank")(
                img.src(viteLogo).alt("Vite logo").class("logo")(),
                "Explore Vite",
              ),
            ),
            li(
              a.href("https://vuejs.org/").target("_blank")(
                img.src(vueLogo).alt("Vue logo").class("button-icon")(),
                "Learn more",
              ),
            ),
          ),
        ),

        div.id("social")(
          div.class("icon")(img.src("/icons.svg#social-icon").alt("Social icon")()),
          header("Connect with us"),
          p("Join the Vite community"),
          ul(
            li(
              a.href("https://github.com/vitejs/vite").target("_blank")(
                svg.class("button-icon").role("presentation").ariaHidden("true")(
                  use.href("/icons.svg#github-icon")(),
                ),
                "GitHub",
              ),
            ),
            li(
              a.href("https://chat.vite.dev/").target("_blank")(
                svg.class("button-icon").role("presentation").ariaHidden("true")(
                  use.href("/icons.svg#discord-icon")(),
                ),
                "Discord",
              ),
            ),
            li(
              a.href("https://x.com/vite_js").target("_blank")(
                svg.class("button-icon").role("presentation").ariaHidden("true")(
                  use.href("/icons.svg#x-icon")(),
                ),
                "X.com",
              ),
            ),
            li(
              a.href("https://bsky.app/profile/vite.dev").target("_blank")(
                svg.class("button-icon").role("presentation").ariaHidden("true")(
                  use.href("/icons.svg#bluesky-icon")(),
                ),
                "Bluesky",
              ),
            ),
          ),
        ),
      ),

      div.class("ticks")(),
      section.id("spacer")(),
    );
});
