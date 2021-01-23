module.exports = {
  title: "Empty916",
  description: "Just playing around",
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      selectText: "Languages",
      label: "English",
      lang: "en-US", // 将会被设置为 <html> 的 lang 属性
      title: "Empty916",
      description: "empty916 site",
    },
    "/zh/": {
      selectText: "选择语言",
      label: "简体中文",
      lang: "zh-CN",
      title: "Empty916",
      description: "empty916的站",
    },
  },
  themeConfig: {
    smoothScroll: true,
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        sidebar: 'auto',
        nav: [
          {
            text: "Natur",
            items: [
              {
                text: "natur",
                link: "/natur/",
              },
            ],
          },
        ],
        sidebar: [
          {
            title: "Natur",
            // path: "/natur",
            children: [
              {
                title: "natur",
                path: "/natur/",
              },
            ],
          },
        ],
      },
      "/zh/": {
        selectText: "选择语言",
        label: "简体中文",
        sidebar: 'auto',
        nav: [
          {
            text: "Natur",
            items: [
              {
                text: "natur",
                link: "/zh/natur/",
              },
              {
                text: "natur api",
                link: "/zh/natur/api",
              },
            ],
          },
        ],
      },
    },
  },
};
