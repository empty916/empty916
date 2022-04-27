module.exports = {
  title: "EMPTY916",
  description: "Just playing around",
  dest: 'dist',
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/": {
      selectText: "Languages",
      label: "English",
      lang: "en-US", // 将会被设置为 <html> 的 lang 属性
      title: "EMPTY916",
      description: "empty site",
    },
    "/zh/": {
      selectText: "选择语言",
      label: "简体中文",
      lang: "zh-CN",
      title: "EMPTY916",
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
        lastUpdated: true,
        nav: [
          {
            text: "Natur",
            items: [
              {
                text: "natur",
                link: "/natur/",
              },
              {
                text: "natur api",
                link: "/natur/api",
              },
              {
                text: "natur-service",
                link: "/natur-service/",
              },
              {
                text: "natur-persist",
                link: "/natur-persist/",
              },
              {
                text: "natur-persist-async",
                link: "/natur-persist-async/",
              },
              {
                text: "natur-immer",
                link: "/natur-immer/",
              },
              {
                text: "umi-natur",
                link: "/umi-natur/",
              },
            ],
          },
          {
            text: 'GitHub',
            link: 'https://github.com/empty916',
          }
        ],
      },
      "/zh/": {
        selectText: "选择语言",
        label: "简体中文",
        sidebar: 'auto',
        lastUpdated: '最后更新',
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
              {
                text: "natur-service",
                link: "/zh/natur-service/",
              },
              {
                text: "natur-persist",
                link: "/zh/natur-persist/",
              },
              {
                text: "natur-persist-async",
                link: "/zh/natur-persist-async/",
              },
              {
                text: "natur-immer",
                link: "/zh/natur-immer/",
              },
              {
                text: "umi-natur",
                link: "/zh/umi-natur/",
              },
            ],
          },
          {
            text: 'GitHub',
            link: 'https://github.com/empty916',
          }
        ],
      },
    },
  },
};
