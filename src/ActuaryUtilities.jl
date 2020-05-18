module ActuaryUtilities

using Dates
using ForwardDiff
using Interpolations
using Optim
using QuadGK

include("financial_math.jl")


"""
    Years_Between(d1::Date, d2::Date)
    
Compute the number of integer years between two dates, with the 
first date typically before the second. Will return negative number if
first date is after the second. Use third argument to indicate if calendar 
anniversary should count as a full year.

# Examples
```jldoctest
julia> d1 = Date(2018,09,30);

julia> d2 = Date(2019,09,30);

julia> d3 = Date(2019,10,01);

julia> years_between(d1,d3) 
1
julia> years_between(d1,d2,false) # same month/day but `false` overlap
0 
julia> years_between(d1,d2) # same month/day but `true` overlap
1 
julia> years_between(d1,d2) # using default `true` overlap
1 
```
"""
function years_between(d1::Date,d2::Date,overlap=true)
    iy,im,id = Dates.year(d1), Dates.month(d1), Dates.day(d1)
    vy,vm,vd = Dates.year(d2), Dates.month(d2), Dates.day(d2)
    dur = vy - iy
    if vm == im
        if overlap
            if vd >= id
                 dur += 1
            end
        else
            if vd > id
                 dur += 1
            end
        end
    elseif vm > im
        dur += 1
    end

    return dur - 1
end


"""
    duration(d1::Date, d2::Date)

Compute the duration given two dates, which is the number of years
since the first date. The interval `[0,1)` is defined as having 
duration `1`. Can return negative durations if second argument is before the first.


```jldoctest
julia> issue_date  = Date(2018,9,30);

julia> duration(issue_date , Date(2019,9,30) ) 
2
julia> duration(issue_date , issue_date) 
1
julia> duration(issue_date , Date(2018,10,1) ) 
1
julia> duration(issue_date , Date(2019,10,1) ) 
2
julia> duration(issue_date , Date(2018,6,30) ) 
0
julia> duration(Date(2018,9,30),Date(2017,6,30)) 
-1
```

"""
function duration(issue_date::Date, proj_date::Date)
    return years_between(issue_date,proj_date,true) + 1
end

export years_between, duration,
    irr, internal_rate_of_return, 
    pv, present_value,
    breakeven,
    InterestCurve,interest_rate,discount_rate,StepwiseInterp,LinearInterp,
    Macaulay,Modified,DV01,duration, convexity

end # module