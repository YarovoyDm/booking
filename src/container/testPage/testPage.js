import React from 'react';
import * as _ from 'lodash';
import Select from 'react-select';
import axios from 'axios'

import './testPage.css';
import { API } from '../../utils';

const requestsData = [
    { requestURL: '/terms', label: 'terms' },
    { requestURL: '/styles', label: 'styles' },
    { requestURL: '/brands_terms', label: 'brandsTerms' },
]

class TestPage extends React.Component {
    state = {
        terms: [],
        styles: [],
        brandsTerms: [],
        termsSelected: null,
        stylesSelected: null,
        brandsTermsSelected: null,
        termsURL: '',
        stylesURL: '',
        brandsTermsURL: '',
        parseData: null
    }

    componentDidMount() {
        const allParams = [this.props.match.params.terms, this.props.match.params.styles, this.props.match.params.brandsTerms]
        const styleForParse = _.filter(allParams, item => {
            if(typeof item === 'string'){
                return _.startsWith(item, 'st-');
            }
        })[0]
        const brandForParse = _.filter(allParams, item => {
            if(typeof item === 'string'){
                return _.startsWith(item, 'b-');
            }
        })[0]
        const termsForParse = _.filter(allParams, item => {
            if(typeof item === 'string'){
                return _.startsWith(item, 's-');
            }
        })[0]
        axios.get('https://beta.autobooking.com/api/test/v1/search/parse_link', {
            params: {
                service_slug: _.split(termsForParse, _.split(this.pref(['termsSelected']), '/')[1])[1],
                brand_slug: _.split(brandForParse, _.split(this.pref(['brandsTermsSelected']), '/')[1])[1],
                style_slug: _.split(styleForParse, _.split(this.pref(['stylesSelected']), '/')[1])[1]
            }
        }).then(res => {
            this.setState({
                termsURL:  termsForParse ? '/' + termsForParse : '',
                stylesURL:  styleForParse ? '/' + styleForParse : '',
                brandsTermsURL:  brandForParse ? '/'+ brandForParse : '',
                parseData: res.data
            })
        })
        _.map(requestsData, item => {
            API(item.requestURL).then((response) => {
                this.setState({
                    [item.label]: response.data,
                })
            })
        })
    }

    pref = (currentDropdown) => {
        if (currentDropdown[0] === 'termsSelected') {
            return '/s-'
        }
        if (currentDropdown[0] === 'brandsTermsSelected') {
            return '/b-'
        }
        if (currentDropdown[0] === 'stylesSelected') {
            return '/st-'
        }
    }

    onChange = (currentDropdown) => (e) => {
        const splitName = _.split(currentDropdown, 'Selected', 1)
        this.setState({
            [currentDropdown]: e.value,
            [splitName + "URL"]: this.pref(currentDropdown) + e.value
        }, () => {
            const url = this.state.termsURL + this.state.stylesURL + this.state.brandsTermsURL
            this.props.history.push('')
            this.props.history.push(url) 
        })
    }

    renderDropdown() {
        const { brandsTerms, styles, terms } = this.state
        const rename = {
            brandsTerms: 'brand',
            styles: 'style',
            terms: 'service'
        }
        if (!brandsTerms || !terms || !styles) { return null }
        return _.map(requestsData, (item, key) => {
            const selected = this.state[item.label + 'Selected']
            const currentValue = _.filter(this.state[item.label].data, selectItem => {
                return selectItem.slug === selected
            })
            if(!this.state.parseData){return null}
            const currentValueParse = this.state.parseData[rename[item.label]]
            const options = _.map(this.state[item.label].data, item => {
                return { value: item.slug, label: item.label }
            })
            if (!currentValue[0] && selected) { return <div key={key}>Loading...</div> }
            const label = this.state.parseData ? currentValueParse.label : selected ? currentValue[0].label : ''
            const value = this.state.parseData ? currentValueParse.label : selected ? currentValue[0].slug : ''
            return <Select
                key={key}
                defaultValue={{ label, value }}
                onChange={this.onChange([item.label + 'Selected'])}
                options={options}
            />
        })
    }

    render() {
        return (
            <div>
                {this.renderDropdown()}
            </div>
        )
    }
}

export default TestPage;
