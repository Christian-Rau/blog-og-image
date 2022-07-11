import type { ParsedRequest, Theme, FileType } from '../api/_lib/types';
const { H, R, copee } = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({ src, onclick, onload, onerror, loading }: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('a',
        { className: 'image-wrapper', href: src, onclick },
        H('img',
            { src, onload, onerror, style, title }
        )
    );
}

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        { className: wrapper },
        H('select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map(o =>
                H('option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div',
            { className: arrow },
            '▼'
        )
    );
}

interface TextInputProps {
    value: string;
    oninput: (val: string) => void;
    small: boolean;
    placeholder?: string;
    type?: string
}

const TextInput = ({ value, oninput, small, type = 'text', placeholder = '' }: TextInputProps) => {
    return H('div',
        { className: 'input-outer-wrapper' + (small ? ' small' : '') },
        H('div',
            { className: 'input-inner-wrapper' },
            H('input',
                { type, value, placeholder, oninput: (e: any) => oninput(e.target.value) }
            )
        )
    );
}

interface ButtonProps {
    label: string;
    onclick: () => void;
}

const Button = ({ label, onclick }: ButtonProps) => {
    return H('button', { onclick }, label);
}

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({ label, input }: FieldProps) => {
    return H('div',
        { className: 'field' },
        H('label', 
            H('div', {className: 'field-label'}, label),
            H('div', { className: 'field-value' }, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = { transform:  show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
    return H('div',
        { className: 'toast-area' },
        H('div',
            { className: 'toast-outer', style },
            H('div',
                { className: 'toast-inner' },
                H('div',
                    { className: 'toast-message'},
                    message
                )
            )
        ),
    );
}

const themeOptions: DropdownOption[] = [
    { text: 'Light', value: 'light' },
    { text: 'Dark', value: 'dark' },
    { text: 'Color', value: 'color' },
];

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const fontSizeOptions: DropdownOption[] = Array
    .from({ length: 10 })
    .map((_, i) => i * 25)
    .filter(n => n > 0)
    .map(n => ({ text: n + 'px', value: n + 'px' }));

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

const imageLightOptions: DropdownOption[] = [
    { text: 'LazyDEVdarkUrl', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/33e8ac13b43c44a65c60c60f0a7093aef952932d/public/img/lazydev-logo-dark-url.svg' },
    { text: 'LazyDEVdarkUrl', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/33e8ac13b43c44a65c60c60f0a7093aef952932d/public/img/lazydev-logo-light-url.svg' },
    { text: 'LazyDEVdarkOutline', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/a0a46406a5bf18d35331888874785af370c748e3/public/img/lazydev-logo-light-outline.svg' },
    { text: 'LazyDEVdarkFilledTrans', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/9a117721519fdb3afbf817170a9d6c586f74f3ab/public/img/lazydev-logo-dark-filled-transparent.svg' },
    { text: 'LazyDEVdarkFilled', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/33e8ac13b43c44a65c60c60f0a7093aef952932d/public/img/lazydev-logo-dark-filled.svg' },
    { text: 'lazydevFaviconDark', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/a0a46406a5bf18d35331888874785af370c748e3/public/img/lazydevFaviconDark.svg' },
    { text: 'Svelte', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/svelte.svg' },
    { text: 'TailwindCSS', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/364bb723c3392e7b6d678e29ed0f0a0108b3d43c/logos/tailwind.svg' },
    { text: 'React', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/react.svg' },
    { text: 'NextJS', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/nextjs.svg' },
    { text: 'Vue', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/vue.svg' },
    { text: 'Nuxt', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/nuxt.svg' },
    { text: 'Astro', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/astro.svg' },
    { text: 'Hugo', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/hugo.svg' },
    { text: 'Markdown', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/markdown.svg' },
    { text: 'GoLang', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/golang.svg' },
    { text: 'MarkdownLight', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/markdown-light.svg' },
    { text: 'FireBase', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/firebase.svg' },
    { text: 'Supabase', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/supabase.svg' },
    { text: 'VSCode', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/vscode.svg' },
    { text: 'Windows', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/windows.svg' },
    { text: 'Linux', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/linux.svg' },
    { text: 'Bash', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/b4a4a42447df8c671017186d26c76aeeb4d155c8/logos/bash.svg' },
];

const imageDarkOptions: DropdownOption[] = [
    { text: 'LazyDEVdarkUrl', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/33e8ac13b43c44a65c60c60f0a7093aef952932d/public/img/lazydev-logo-light-url.svg' },
    { text: 'LazyDEVdarkFilled', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/33e8ac13b43c44a65c60c60f0a7093aef952932d/public/img/lazydev-logo-dark-filled.svg' },
    { text: 'LazyDEVlightFilledTrans', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/9a117721519fdb3afbf817170a9d6c586f74f3ab/public/img/lazydev-logo-light-filled-transparent.svg' },
    { text: 'lazydevFaviconLight', value: 'https://raw.githubusercontent.com/Christian-Rau/blog-og-image/a0a46406a5bf18d35331888874785af370c748e3/public/img/lazydevFaviconLight.svg' },
    { text: 'Svelte', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/svelte.svg' },
    { text: 'TailwindCSS', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/364bb723c3392e7b6d678e29ed0f0a0108b3d43c/logos/tailwind.svg' },
    { text: 'React', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/react.svg' },
    { text: 'NextJS', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/nextjs.svg' },
    { text: 'Vue', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/vue.svg' },
    { text: 'Nuxt', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/nuxt.svg' },
    { text: 'Astro', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f67c7433dc4b8cbce121e02e1a4df318fb6ce2c4/logos/astro.svg' },
    { text: 'Hugo', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/hugo.svg' },
    { text: 'Markdown', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/markdown.svg' },
    { text: 'GoLang', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/golang.svg' },
    { text: 'MarkdownLight', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/markdown-light.svg' },
    { text: 'FireBase', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/firebase.svg' },
    { text: 'Supabase', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/supabase.svg' },
    { text: 'VSCode', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/vscode.svg' },
    { text: 'Windows', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/windows.svg' },
    { text: 'Linux', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/f0ae6be42dcff80072cda14bd6f1115f8b9294ab/logos/linux.svg' },
    { text: 'Bash', value: 'https://raw.githubusercontent.com/Christian-Rau/graphics-and-logoes/b4a4a42447df8c671017186d26c76aeeb4d155c8/logos/bash.svg' },
];


interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    selectedImageIndex: number;
    widths: string[];
    heights: string[];
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({ overrideUrl: null }), 200);
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'png',
        fontSize = '100px',
        theme = 'light',
        md = true,
        text = 'How **automate** this?',
        images=[imageLightOptions[0].value],
        widths=[],
        heights=[],
        showToast = false,
        messageToast = '',
        loading = true,
        selectedImageIndex = 0,
        overrideUrl = null,
    } = state;

    const mdValue = md ? '1' : '0';
    const imageOptions = theme === 'light' ? imageLightOptions : imageDarkOptions;
    const url = new URL(window.location.origin);
    url.pathname = `${encodeURIComponent(text)}.${fileType}`;
    url.searchParams.append('theme', theme);
    url.searchParams.append('md', mdValue);
    url.searchParams.append('fontSize', fontSize);
    for (let image of images) {
        url.searchParams.append('images', image);
    }
    for (let width of widths) {
        url.searchParams.append('widths', width);
    }
    for (let height of heights) {
        url.searchParams.append('heights', height);
    }

    return H('div',
        { className: 'split' },
        H('div',
            { className: 'pull-left' },
            H('div',
                H(Field, {
                    label: 'Theme',
                    input: H(Dropdown, {
                        options: themeOptions,
                        value: theme,
                        onchange: (val: Theme) => {
                            const options = val === 'light' ? imageLightOptions : imageDarkOptions
                            let clone = [...images];
                            clone[0] = options[selectedImageIndex].value;
                            setLoadingState({ theme: val, images: clone });
                        }
                    })
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({ fileType: val })
                    })
                }),
                H(Field, {
                    label: 'Font Size',
                    input: H(Dropdown, {
                        options: fontSizeOptions,
                        value: fontSize,
                        onchange: (val: string) => setLoadingState({ fontSize: val })
                    })
                }),
                H(Field, {
                    label: 'Text Type',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) => setLoadingState({ md: val === '1' })
                    })
                }),
                H(Field, {
                    label: 'Text Input',
                    input: H(TextInput, {
                        value: text,
                        oninput: (val: string) => {
                            console.log('oninput ' + val);
                            setLoadingState({ text: val, overrideUrl: url });
                        }
                    })
                }),
                H(Field, {
                    label: 'Image 1',
                    input: H('div',
                        H(Dropdown, {
                            options: imageOptions,
                            value: imageOptions[selectedImageIndex].value,
                            onchange: (val: string) =>  {
                                let clone = [...images];
                                clone[0] = val;
                                const selected = imageOptions.map(o => o.value).indexOf(val);
                                setLoadingState({ images: clone, selectedImageIndex: selected });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(TextInput, {
                                value: widths[0],
                                type: 'number',
                                placeholder: 'width',
                                small: true,
                                oninput: (val: string) =>  {
                                    let clone = [...widths];
                                    clone[0] = val;
                                    setLoadingState({ widths: clone });
                                }
                            }),
                            H(TextInput, {
                                value: heights[0],
                                type: 'number',
                                placeholder: 'height',
                                small: true,
                                oninput: (val: string) =>  {
                                    let clone = [...heights];
                                    clone[0] = val;
                                    setLoadingState({ heights: clone });
                                }
                            })
                        )
                    ),
                }),
                ...images.slice(1).map((image, i) => H(Field, {
                    label: `Image ${i + 2}`,
                    input: H('div',
                        H(TextInput, {
                            value: image,
                            oninput: (val: string) => {
                                let clone = [...images];
                                clone[i + 1] = val;
                                setLoadingState({ images: clone, overrideUrl: url });
                            }
                        }),
                        H('div',
                            { className: 'field-flex' },
                            H(TextInput, {
                                value: widths[i + 1],
                                type: 'number',
                                placeholder: 'width',
                                small: true,
                                oninput: (val: string) =>  {
                                    let clone = [...widths];
                                    clone[i + 1] = val;
                                    setLoadingState({ widths: clone });
                                }
                            }),
                            H(TextInput, {
                                value: heights[i + 1],
                                type: 'number',
                                placeholder: 'height',
                                small: true,
                                oninput: (val: string) =>  {
                                    let clone = [...heights];
                                    clone[i + 1] = val;
                                    setLoadingState({ heights: clone });
                                }
                            })
                        ),
                        H('div',
                            { className: 'field-flex' },
                            H(Button, {
                                label: `Remove Image ${i + 2}`,
                                onclick: (e: MouseEvent) => {
                                    e.preventDefault();
                                    const filter = (arr: any[]) => [...arr].filter((_, n) => n !== i + 1);
                                    const imagesClone = filter(images);
                                    const widthsClone = filter(widths);
                                    const heightsClone = filter(heights);
                                    setLoadingState({ images: imagesClone, widths: widthsClone, heights: heightsClone });
                                }
                            })
                        )
                    )
                })),
                H(Field, {
                    label: `Image ${images.length + 1}`,
                    input: H(Button, {
                        label: `Add Image ${images.length + 1}`,
                        onclick: () => {
                            const nextImage = images.length === 1
                                ? 'https://cdn.jsdelivr.net/gh/remojansen/logo.ts@master/ts.svg'
                                : '';
                            setLoadingState({ images: [...images, nextImage] })
                        }
                    }),
                }),
            )
        ),
        H('div',
            { className: 'pull-right' },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({ showToast: true, messageToast: 'Oops, an error occurred' });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    const success = copee.toClipboard(url.href);
                    if (success) {
                        setState({ showToast: true, messageToast: 'Copied image URL to clipboard' });
                        setTimeout(() => setState({ showToast: false }), 3000);
                    } else {
                        window.open(url.href, '_blank');
                    }
                    return false;
                }
            })
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
