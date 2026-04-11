/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NoNgNARAzAdADDAjBSAOArAdgJzZCKAJkPT0SKimwBZVC5VcM5t0GGUIBTAOxTjDBEYAQOFiAupHRcuAIziEAxhAlA==
 */

const {
    ClassicEditor,
    Autosave,
    Essentials,
    Paragraph,
    LinkImage,
    Link,
    ImageBlock,
    ImageToolbar,
    BlockQuote,
    CloudServices,
    ImageUpload,
    ImageInsertViaUrl,
    AutoImage,
    Table,
    TableToolbar,
    Heading,
    ImageTextAlternative,
    ImageCaption,
    ImageStyle,
    Indent,
    IndentBlock,
    ImageInline,
    List,
    TableCaption,
    TodoList,
    MediaEmbed,
    Markdown,
    PasteFromMarkdownExperimental,
    HorizontalLine,
    CodeBlock,
    Alignment,
    Style,
    GeneralHtmlSupport
} = window.CKEDITOR;

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Nzk0OTQzOTksImp0aSI6ImNkODdiNDhlLTQ0ZTEtNDI5MS04MzU3LWM0ZGM1ZjBjZDQ1ZSIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiRTJQIiwiRTJXIl0sInZjIjoiMTUwYjk5MzUifQ.62Qq-WhOW603OykHTpqk-CFq78oT8PyCxOyIMwbSyosOESKysChtr2SQe6na616t7E5a9kjGeoW_ugld3r6QqQ';

const editorConfig = {
    attachTo: document.querySelector('#editor'),
    root: {
        placeholder: 'Type or paste your content here!',
    },
    toolbar: {
        items: [
            'undo',
            'redo',
            '|',
            'heading',
            'style',
            '|',
            'horizontalLine',
            'link',
            'mediaEmbed',
            'insertTable',
            'blockQuote',
            'codeBlock',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent'
        ],
        shouldNotGroupWhenFull: false
    },
    plugins: [
        Alignment,
        AutoImage,
        Autosave,
        BlockQuote,
        CloudServices,
        CodeBlock,
        Essentials,
        GeneralHtmlSupport,
        Heading,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsertViaUrl,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Link,
        LinkImage,
        List,
        Markdown,
        MediaEmbed,
        Paragraph,
        PasteFromMarkdownExperimental,
        Style,
        Table,
        TableCaption,
        TableToolbar,
        TodoList
    ],
    licenseKey: LICENSE_KEY,
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph'
            },
            {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
            },
            {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
            },
            {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
            },
            {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4'
            },
            {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5'
            },
            {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6'
            }
        ]
    },
    htmlSupport: {
        allow: [
            {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true
            }
        ]
    },
    image: {
        toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText']
    },
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    style: {
        definitions: [
            {
                name: 'Article category',
                element: 'h3',
                classes: ['category']
            },
            {
                name: 'Title',
                element: 'h2',
                classes: ['document-title']
            },
            {
                name: 'Subtitle',
                element: 'h3',
                classes: ['document-subtitle']
            },
            {
                name: 'Info box',
                element: 'p',
                classes: ['info-box']
            },
            {
                name: 'CTA Link Primary',
                element: 'a',
                classes: ['button', 'button--green']
            },
            {
                name: 'CTA Link Secondary',
                element: 'a',
                classes: ['button', 'button--black']
            },
            {
                name: 'Marker',
                element: 'span',
                classes: ['marker']
            },
            {
                name: 'Spoiler',
                element: 'span',
                classes: ['spoiler']
            }
        ]
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
};

ClassicEditor.create(editorConfig);
